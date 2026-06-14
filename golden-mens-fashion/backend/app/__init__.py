from flask import Flask, send_from_directory
from flask_cors import CORS

from app.config import Config

from app.extensions import (
    db,
    migrate,
    bcrypt,
    jwt,
    mail
)

from app.routes.auth_routes    import auth_bp
from app.routes.product_routes import product_bp
from app.routes.order_routes   import order_bp
from app.routes.cart_routes    import cart_bp
from app.routes.payment_routes import payment_bp
from app.routes.admin_routes   import admin_bp

from app.models.user_model    import User
from app.models.product_model import Product
from app.models.order_model   import Order, OrderItem
from app.models.cart_model    import Cart, CartItem
from app.models.payment_model import Payment


def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    # ── Stops Flask redirecting /api/orders → /api/orders/ ──
    app.url_map.strict_slashes = False

    # ── CORS ─────────────────────────────────────────────────
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True
    )

    # ── Extensions ───────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    # ── Blueprints ───────────────────────────────────────────
    app.register_blueprint(auth_bp,     url_prefix="/api/auth")
    app.register_blueprint(product_bp,  url_prefix="/api/products")
    app.register_blueprint(order_bp,    url_prefix="/api/orders")
    app.register_blueprint(cart_bp,     url_prefix="/api/cart")
    app.register_blueprint(payment_bp,  url_prefix="/api/payments")
    app.register_blueprint(admin_bp,    url_prefix="/api/admin")

    # ── Uploads ──────────────────────────────────────────────
    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app