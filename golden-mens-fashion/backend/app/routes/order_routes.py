from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.order_model import Order, OrderItem
from app.models.product_model import Product
from app.models.cart_model import Cart, CartItem
from app.models.user_model import User
from app.utils.rbac import role_required
from app.utils.email_service import send_order_email

order_bp = Blueprint("order_bp", __name__)


# =========================
# CREATE ORDER MANUALLY
# =========================
@order_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}
    items   = data.get("items")

    if not items:
        return jsonify({"message": "No items provided"}), 400

    if not data.get("address") or not data.get("phone"):
        return jsonify({"message": "Address and phone are required"}), 400

    total          = 0
    product_updates = []

    for item in items:
        product = Product.query.get(item.get("product_id"))

        if not product:
            return jsonify({"message": f"Product {item.get('product_id')} not found"}), 404

        if not product.is_active:
            return jsonify({"message": f"{product.name} is no longer available"}), 400

        qty = item.get("quantity", 1)

        if product.stock < qty:
            return jsonify({"message": f"Not enough stock for {product.name}"}), 400

        total += float(product.price) * qty
        product_updates.append((product, qty))

    order = Order(
        user_id=user_id,
        address=data["address"],
        phone=data["phone"],
        total=round(total, 2),
        status="pending"
    )

    db.session.add(order)
    db.session.flush()

    for product, qty in product_updates:
        db.session.add(OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=qty,
            unit_price=product.price
        ))
        product.stock -= qty

    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order": {
            "order_id": order.order_id,
            "total":    order.total,
            "status":   order.status
        }
    }), 201


# =========================
# GET USER ORDERS
# =========================
@order_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_orders():
    user_id = int(get_jwt_identity())

    orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_id.desc()).all()

    return jsonify([order.to_dict() for order in orders])


# =========================
# GET SINGLE ORDER
# =========================
@order_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    user_id = int(get_jwt_identity())

    order = Order.query.filter_by(order_id=order_id, user_id=user_id).first()

    if not order:
        return jsonify({"message": "Order not found"}), 404

    return jsonify(order.to_dict())


# =========================
# ADMIN UPDATE ORDER STATUS
# =========================
@order_bp.route("/<int:order_id>/status", methods=["PUT"])
@jwt_required()
@role_required(["admin"])
def update_status(order_id):
    data  = request.get_json(silent=True) or {}
    order = Order.query.get_or_404(order_id)

    allowed = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]
    status  = data.get("status")

    if status not in allowed:
        return jsonify({"message": f"Invalid status. Must be one of: {', '.join(allowed)}"}), 400

    order.status = status
    db.session.commit()

    return jsonify({"message": "Order status updated", "status": order.status})


# =========================
# CHECKOUT FROM CART
# =========================
@order_bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    if not data.get("address") or not data.get("phone"):
        return jsonify({"message": "Address and phone are required"}), 400

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or not cart.cart_items:
        return jsonify({"message": "Your cart is empty"}), 400

    total = 0

    for item in cart.cart_items:
        product = item.product

        if not product or not product.is_active:
            return jsonify({"message": f"A product in your cart is no longer available"}), 400

        if product.stock < item.quantity:
            return jsonify({"message": f"Not enough stock for {product.name}"}), 400

        total += float(product.price) * item.quantity

    order = Order(
        user_id=user_id,
        address=data["address"],
        phone=data["phone"],
        total=round(total, 2),
        status="pending"
    )

    db.session.add(order)
    db.session.flush()

    for item in cart.cart_items:
        product = item.product
        db.session.add(OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=item.quantity,
            unit_price=product.price
        ))
        product.stock -= item.quantity

    CartItem.query.filter_by(cart_id=cart.cart_id).delete()
    db.session.commit()

    # Send confirmation email — non-blocking
    try:
        user = User.query.get(user_id)
        if user:
            send_order_email(user.email, order.order_id, total)
    except Exception:
        pass  # don't fail the order if email fails

    return jsonify({
        "message":  "Checkout successful",
        "order_id": order.order_id,
        "total":    order.total,
        "status":   order.status
    }), 201