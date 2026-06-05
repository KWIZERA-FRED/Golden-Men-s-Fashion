from flask import Blueprint, request, jsonify
from app.extensions import db, bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_model import User

auth_bp = Blueprint("auth_bp", __name__)

#Registration Authentificaion

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    # check if user exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    # hash password
    hashed_password = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password,
        phone=data.get("phone"),
        role=data.get("role", "user")  # default role
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201

#Login Authentication

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    if not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    # CLEAN JWT STRUCTURE
    token = create_access_token(
                identity=user.user_id,
                additional_claims={
                    "role": user.role
                }
)

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })

#Current Logged-In User Authentification

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():

    identity = get_jwt_identity()

    user = User.query.get(identity["user_id"])

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "user": {
            "id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })
#This defines access to only users who logged in, received a JWT token, send token in request header
