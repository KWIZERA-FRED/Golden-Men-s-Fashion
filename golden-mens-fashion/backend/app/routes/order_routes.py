from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.order_model import Order, OrderItem
from app.models.product_model import Product

order_bp = Blueprint("order_bp", __name__)

#create order
@order_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():

    data = request.get_json()
    identity = get_jwt_identity()
    user_id = identity["user_id"]

    items = data.get("items")

    if not items:
        return jsonify({"message": "No items ordered yet !"}), 400

    total = 0
    product_updates = []

    # STEP 1: VALIDATE ITEMS + CALCULATE TOTAL
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

        product_updates.append((product, item["quantity"], item["quantity"] * product.price))

    # STEP 2: CREATE ORDER
    order = Order(
        user_id=user_id,
        address=data["address"],
        phone=data["phone"],
        total=total
    )

    db.session.add(order)
    db.session.flush()  # get order_id before commit

    # STEP 3: CREATE ORDER ITEMS + UPDATE STOCK
    for product, qty, _ in product_updates:

        order_item = OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=qty,
            unit_price=product.price
        )

        product.stock -= qty

        db.session.add(order_item)

    # STEP 4: SAVE EVERYTHING
    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order": {
            "order_id": order.order_id,
            "total": order.total
        }
    }), 201