from app.extensions import db
from sqlalchemy.sql import func


class Order(db.Model):

    __tablename__ = "orders"

    order_id   = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False, index=True)
    address    = db.Column(db.String(255), nullable=False)
    phone      = db.Column(db.String(20), nullable=False)
    total      = db.Column(db.Float, nullable=False)
    status     = db.Column(db.String(30), default="pending", index=True)
    created_at = db.Column(db.DateTime, server_default=func.now())

    items = db.relationship("OrderItem", backref="order", lazy=True)

    def to_dict(self):
        return {
            "order_id":   self.order_id,
            "user_id":    self.user_id,
            "address":    self.address,
            "phone":      self.phone,
            "total":      self.total,
            "status":     self.status,
            "created_at": self.created_at.isoformat(),
            "items":      [item.to_dict() for item in self.items]
        }


class OrderItem(db.Model):

    __tablename__ = "order_items"

    order_item_id = db.Column(db.Integer, primary_key=True)
    order_id      = db.Column(db.Integer, db.ForeignKey("orders.order_id"), nullable=False, index=True)
    product_id    = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False, index=True)
    quantity      = db.Column(db.Integer, nullable=False)
    unit_price    = db.Column(db.Float, nullable=False)

    # NO relationship here — Product already defines it via backref="product"

    def to_dict(self):
        return {
            "order_item_id": self.order_item_id,
            "order_id":      self.order_id,
            "product_id":    self.product_id,
            "name":          self.product.name      if self.product else "Unknown",
            "image_url":     self.product.image_url if self.product else None,
            "quantity":      self.quantity,
            "unit_price":    self.unit_price,
            "subtotal":      round(self.unit_price * self.quantity, 2)
        }