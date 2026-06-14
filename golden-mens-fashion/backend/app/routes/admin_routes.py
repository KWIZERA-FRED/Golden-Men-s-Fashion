from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.user_model import User
from app.models.product_model import Product
from app.utils.rbac import role_required

admin_bp = Blueprint("admin_bp", __name__)


@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@role_required(["admin"])
def get_stats():
    total_users = User.query.count()
    total_products = Product.query.filter_by(is_active=True).count()

    return jsonify({
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": 0,
        "total_revenue": 0
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


@admin_bp.route("/orders", methods=["GET"])
@jwt_required()
@role_required(["admin"])
def get_all_orders():
    # plug in your Order model when ready
    return jsonify({"orders": []})