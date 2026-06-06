from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db

from app.models.cart_model import Cart, CartItem
from app.models.product_model import Product

cart_bp = Blueprint("cart_bp", __name__)

#Add products to cart
@cart_bp.route("/add", methods=["POST"])
@jwt_required()
def add_to_cart():

    identity = get_jwt_identity()
    user_id = identity["user_id"]

    data = request.get_json()

    product = Product.query.get(data["product_id"])

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404

    # get or create cart
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.flush()

    # check if item already exists
    existing_item = CartItem.query.filter_by(
        cart_id=cart.cart_id,
        product_id=product.product_id
    ).first()

    if existing_item:
        existing_item.quantity += data.get("quantity", 1)

    else:
        cart_item = CartItem(
            cart_id=cart.cart_id,
            product_id=product.product_id,
            quantity=data.get("quantity", 1)
        )

        db.session.add(cart_item)

    db.session.commit()

    return jsonify({
        "message": "Product added to cart"
    }), 201