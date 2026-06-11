from app.extensions import db
from datetime import datetime


class Payment(db.Model):

    __tablename__ = "payments"

    payment_id = db.Column(
        db.Integer,
        primary_key=True
    )

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.order_id"),
        nullable=False
    )

    amount = db.Column(
        db.Float,
        nullable=False
    )

    payment_method = db.Column(
        db.String(50),
        nullable=False
    )

    transaction_id = db.Column(
        db.String(255),
        unique=True
    )

    status = db.Column(
        db.String(30),
        default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # relationship
    order = db.relationship(
        "Order",
        backref="payment",
        lazy=True
    )