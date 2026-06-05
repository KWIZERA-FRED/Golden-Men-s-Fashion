from flask import Flask

from app.config import Config

from app.extensions import (
    db,
    migrate,
    bcrypt,
    jwt
)
# Import models (VERY IMPORTANT for migrations)
from app.models.user_model import User
from app.models.product_model import Product
from app.models.order_model import Order, OrderItem

def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    return app