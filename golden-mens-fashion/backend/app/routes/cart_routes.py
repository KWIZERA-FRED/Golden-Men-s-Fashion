from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db

from app.models.cart_model import Cart, CartItem
from app.models.product_model import Product

cart_bp = Blueprint("cart_bp", __name__)

#Add products to cart
@cart_bp.route("/add", methods=["POST"])
@jwt_required() #Only authenticated users can use this endpoint.
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
        db.session.flush()  #create an immediate cart id if the db for cart has none

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
# view cart 
@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():

    user_id = get_jwt_identity()

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({
            "cart_items": [],
            "total": 0
        })

    items = []
    total = 0

    for item in cart.cart_items:

        subtotal = item.quantity * item.product.price
        total += subtotal

        items.append({
            "cart_item_id": item.cart_item_id,
            "product_id": item.product.product_id,
            "name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "subtotal": subtotal
        })

    return jsonify({
        "cart_items": items,
        "total": total
    })

#Remove cart items
@cart_bp.route("/remove/<int:item_id>", methods=["DELETE"])
@jwt_required()
def remove_from_cart(item_id):

    item = CartItem.query.get_or_404(item_id)

    db.session.delete(item)

    db.session.commit()

    return jsonify({
        "message": "Item removed from cart"
    })