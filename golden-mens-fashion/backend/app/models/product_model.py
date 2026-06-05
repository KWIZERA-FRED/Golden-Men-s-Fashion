from app.extensions import db


class Product(db.Model):

    __tablename__ = "products"

    product_id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False, index=True)

    description = db.Column(db.Text)

    price = db.Column(db.Float, nullable=False)

    stock = db.Column(db.Integer, default=0)

    category_id = db.Column(db.Integer, index=True)

    image_url = db.Column(db.String(255))

    is_featured = db.Column(db.Boolean, default=False)

    is_active = db.Column(db.Boolean, default=True)

    # relationships
    order_items = db.relationship("OrderItem", backref="product", lazy=True)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "image_url": self.image_url,
            "is_featured": self.is_featured,
            "is_active": self.is_active
        }