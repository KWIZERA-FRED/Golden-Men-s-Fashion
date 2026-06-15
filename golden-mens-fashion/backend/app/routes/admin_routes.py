from flask import Blueprint, jsonify,request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.user_model import User
from app.models.product_model import Product
from app.models.order_model import Order
from app.utils.rbac import role_required

admin_bp = Blueprint("admin_bp", __name__)

#Retrieve Stats
@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@role_required(["admin"])
def get_stats():

    total_users = User.query.count()
    total_products = Product.query.filter_by(is_active=True).count()
    total_orders = Order.query.count()

    revenue = db.session.query(
        db.func.coalesce(db.func.sum(Order.total), 0)
    ).filter(
        Order.status.in_(["paid", "processing", "shipped", "delivered"])
    ).scalar()

    return jsonify({
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": float(revenue)
    })


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required(["admin"])
def get_all_users():
    users = User.query.all()
    return jsonify({
        "users": [
            {
                "id": u.user_id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "phone": u.phone
            }
            for u in users
        ]
    })

#Retrieve all orders
@admin_bp.route("/orders", methods=["GET"])
@jwt_required()
@role_required(["admin"])
def get_all_orders():

    orders = Order.query.order_by(Order.order_id.desc()).all()

    return jsonify({
        "orders": [
            {
                "order_id": order.order_id,
                "user_id": order.user_id,
                "customer_name": order.user.name if order.user else None,
                "customer_email": order.user.email if order.user else None,
                "phone": order.phone,
                "address": order.address,
                "total": float(order.total),
                "status": order.status,
                "created_at": order.created_at.isoformat() if order.created_at else None
            }
            for order in orders
        ]
    })    

@admin_bp.route("/orders/<int:order_id>", methods=["PUT"])
@jwt_required()
@role_required(["admin"])
def update_order(order_id):

    order = Order.query.get_or_404(order_id)

    data = request.get_json(silent=True) or {}

    # Update address
    if "address" in data:
        order.address = data["address"]

    # Update phone
    if "phone" in data:
        order.phone = data["phone"]

    # Update status
    if "status" in data:
        allowed_statuses = [
            "pending",
            "paid",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ]

        if data["status"] not in allowed_statuses:
            return jsonify({
                "message": f"Status must be one of {allowed_statuses}"
            }), 400

        order.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Order updated successfully",
        "order": {
            "order_id": order.order_id,
            "user_id": order.user_id,
            "address": order.address,
            "phone": order.phone,
            "total": float(order.total),
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None
        }
    })  