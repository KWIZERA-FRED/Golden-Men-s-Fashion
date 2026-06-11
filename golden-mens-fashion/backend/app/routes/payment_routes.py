from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db

from app.models.order_model import Order
from app.models.payment_model import Payment

import uuid

#initiate payment
payment_bp = Blueprint("payment_bp", __name__)
@payment_bp.route("/pay/<int:order_id>", methods=["POST"])
@jwt_required()
def make_payment(order_id):

    user_id = get_jwt_identity()

    order = Order.query.filter_by(
        order_id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    # prevent double payment
    existing_payment = Payment.query.filter_by(
        order_id=order.order_id,
        status="successful"
    ).first()

    if existing_payment:
        return jsonify({
            "message": "Order already paid"
        }), 400

    data = request.get_json()

    payment_method = data.get(
        "payment_method",
        "momo"
    )

    # generate fake transaction id
    transaction_id = str(uuid.uuid4())

    payment = Payment(
        order_id=order.order_id,
        amount=order.total,
        payment_method=payment_method,
        transaction_id=transaction_id,
        status="successful"
    )

    # update order status
    order.status = "paid"

    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "message": "Payment successful",
        "transaction_id": transaction_id,
        "status": payment.status
    })

#Get payment details
@payment_bp.route("/<int:payment_id>", methods=["GET"])
@jwt_required()
def get_payment(payment_id):

    payment = Payment.query.get_or_404(payment_id)

    return jsonify({
        "payment_id": payment.payment_id,
        "order_id": payment.order_id,
        "amount": payment.amount,
        "method": payment.payment_method,
        "status": payment.status,
        "transaction_id": payment.transaction_id
    })