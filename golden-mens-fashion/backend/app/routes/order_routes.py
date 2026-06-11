from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db

from app.models.order_model import Order, OrderItem
from app.models.product_model import Product
from app.models.cart_model import Cart, CartItem

from app.utils.rbac import role_required

from app.models.user_model import User
from app.utils.email_service import send_order_email

order_bp = Blueprint("order_bp", __name__)


# =========================
# CREATE ORDER MANUALLY
# =========================
@order_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():

    data = request.get_json()

    identity = get_jwt_identity()
    user_id = identity["user_id"]

    items = data.get("items")

    if not items:
        return jsonify({
            "message": "No items ordered yet!"
        }), 400

    total = 0
    product_updates = []

    # validate items + calculate total
    for item in items:

        product = Product.query.get(item["product_id"])

        if not product:
            return jsonify({
                "message": f"Product {item['product_id']} not found"
            }), 404

        if product.stock < item["quantity"]:
            return jsonify({
                "message": f"Not enough stock for {product.name}"
            }), 400

        subtotal = product.price * item["quantity"]
        total += subtotal

        product_updates.append(
            (product, item["quantity"])
        )

    # create order
    order = Order(
        user_id=user_id,
        address=data["address"],
        phone=data["phone"],
        total=total,
        status="pending"
    )

    db.session.add(order)

    # get order_id before commit
    db.session.flush()

    # create order items + reduce stock
    for product, qty in product_updates:

        order_item = OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=qty,
            unit_price=product.price
        )

        product.stock -= qty

        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order": {
            "order_id": order.order_id,
            "total": order.total,
            "status": order.status
        }
    }), 201


# =========================
# GET USER ORDERS
# =========================
@order_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_orders():

    identity = get_jwt_identity()
    user_id = identity["user_id"]

    orders = Order.query.filter_by(
        user_id=user_id
    ).all()

    return jsonify([
        order.to_dict()
        for order in orders
    ])


# =========================
# GET SINGLE ORDER
# =========================
@order_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):

    identity = get_jwt_identity()
    user_id = identity["user_id"]

    order = Order.query.filter_by(
        order_id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    return jsonify(order.to_dict())


# =========================
# ADMIN UPDATE ORDER STATUS
# =========================
@order_bp.route("/<int:order_id>/status", methods=["PUT"])
@jwt_required()
@role_required(["admin"])
def update_status(order_id):

    data = request.get_json()

    order = Order.query.get_or_404(order_id)

    order.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Order status updated",
        "status": order.status
    })


# =========================
# CHECKOUT FROM CART
# =========================
@order_bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():

    identity = get_jwt_identity()
    user_id = identity["user_id"]

    data = request.get_json()

    # get user's cart
    cart = Cart.query.filter_by(
        user_id=user_id
    ).first()

    if not cart or not cart.cart_items:
        return jsonify({
            "message": "Cart is empty"
        }), 400

    total = 0

    # validate stock + calculate total
    for item in cart.cart_items:

        product = item.product

        if not product:
            return jsonify({
                "message": "Product not found"
            }), 404

        if product.stock < item.quantity:
            return jsonify({
                "message": f"Not enough stock for {product.name}"
            }), 400

        total += product.price * item.quantity

    # create order
    order = Order(
        user_id=user_id,
        address=data["address"],
        phone=data["phone"],
        total=total,
        status="pending"
    )

    db.session.add(order)

    # generate order_id before commit
    db.session.flush()

    # create order items + reduce stock
    for item in cart.cart_items:

        product = item.product

        order_item = OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=item.quantity,
            unit_price=product.price
        )

        db.session.add(order_item)

        # reduce stock
        product.stock -= item.quantity

    # clear cart
    CartItem.query.filter_by(
        cart_id=cart.cart_id
    ).delete()

    db.session.commit()

    # send confirmation email
    user = User.query.get(user_id)

    send_order_email(
        user.email,
        order.order_id,
        total
    )
    

    return jsonify({
        "message": "Checkout successful",
        "order_id": order.order_id,
        "total": total,
        "status": order.status
    }), 201