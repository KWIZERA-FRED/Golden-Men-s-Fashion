from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.product_model import Product
from app.utils.rbac import role_required
import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

product_bp = Blueprint("product_bp", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@product_bp.route("/", methods=["POST"], strict_slashes=False)
@jwt_required()
@role_required(["admin"])
def create_product():
    data = request.get_json()

    if not data.get("name") or not data.get("price"):
        return jsonify({"message": "Name and price are required"}), 400

    product = Product(
        name=data["name"],
        description=data.get("description"),
        price=data["price"],
        stock=data.get("stock", 0),
        category_id=data.get("category_id"),
        image_url=data.get("image_url"),
        is_featured=data.get("is_featured", False),
        is_active=data.get("is_active", True)
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({"message": "Product created successfully", "product": product.to_dict()}), 201


@product_bp.route("/", methods=["GET"], strict_slashes=False)
def get_products():
    include_inactive = request.args.get("include_inactive", "false").lower() == "true"
    search = request.args.get("search")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    query = Product.query if include_inactive else Product.query.filter_by(is_active=True)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    products = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "products": [p.to_dict() for p in products.items],
        "total": products.total,
        "pages": products.pages,
        "current_page": page
    })


@product_bp.route("/<int:product_id>", methods=["GET"], strict_slashes=False)
def get_single_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())


@product_bp.route("/<int:product_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
@role_required(["admin"])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    product.name        = data.get("name",        product.name)
    product.description = data.get("description", product.description)
    product.price       = data.get("price",       product.price)
    product.stock       = data.get("stock",       product.stock)
    product.image_url   = data.get("image_url",   product.image_url)
    product.is_featured = data.get("is_featured", product.is_featured)
    product.is_active   = data.get("is_active",   product.is_active)  # ← was missing

    db.session.commit()

    return jsonify({"message": "Product updated successfully", "product": product.to_dict()})


@product_bp.route("/<int:product_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
@role_required(["admin"])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    product.is_active = False
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"})


@product_bp.route("/upload-image", methods=["POST"], strict_slashes=False)
@jwt_required()
@role_required(["admin"])
def upload_product_image():
    if "image" not in request.files:
        return jsonify({"message": "No image uploaded"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"message": "Invalid file type"}), 400

    extension = file.filename.rsplit(".", 1)[1].lower()
    filename  = f"{uuid.uuid4()}.{extension}"
    filepath  = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)

    file.save(filepath)

    return jsonify({"message": "Image uploaded successfully", "image_url": f"/uploads/{filename}"}), 201