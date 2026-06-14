from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.cart_model import Cart, CartItem
from app.models.product_model import Product

cart_bp = Blueprint("cart_bp", __name__)


@cart_bp.route("/add", methods=["POST"], strict_slashes=False)
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    product_id = data.get("product_id")
    quantity   = int(data.get("quantity", 1))

    if not product_id:
        return jsonify({"message": "product_id is required"}), 400

    if quantity < 1:
        return jsonify({"message": "Quantity must be at least 1"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    if not product.is_active:
        return jsonify({"message": "Product is no longer available"}), 400

    if product.stock is not None and quantity > product.stock:
        return jsonify({"message": f"Only {product.stock} units available"}), 400

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.flush()

    existing_item = CartItem.query.filter_by(
        cart_id=cart.cart_id,
        product_id=product.product_id
    ).first()

    if existing_item:
        new_qty = existing_item.quantity + quantity
        if product.stock is not None and new_qty > product.stock:
            return jsonify({"message": f"Only {product.stock} units available"}), 400
        existing_item.quantity = new_qty
    else:
        db.session.add(CartItem(
            cart_id=cart.cart_id,
            product_id=product.product_id,
            quantity=quantity
        ))

    db.session.commit()
    return jsonify({"message": "Product added to cart"}), 201


@cart_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({"cart_items": [], "total": 0})

    items = []
    total = 0

    for item in cart.cart_items:
        subtotal = item.quantity * float(item.product.price)
        total   += subtotal
        items.append({
            "cart_item_id": item.cart_item_id,
            "product_id":   item.product.product_id,
            "name":         item.product.name,
            "price":        float(item.product.price),
            "quantity":     item.quantity,
            "subtotal":     subtotal,
            "image_url":    item.product.image_url or None
        })

    return jsonify({"cart_items": items, "total": round(total, 2)})


@cart_bp.route("/remove/<int:item_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def remove_from_cart(item_id):
    user_id = int(get_jwt_identity())

    item = CartItem.query.get_or_404(item_id)

    # Ensure the item belongs to this user's cart
    if item.cart.user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"})