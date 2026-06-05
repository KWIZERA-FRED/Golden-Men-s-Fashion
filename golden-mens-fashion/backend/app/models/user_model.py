from app.extensions import db


class User(db.Model):

    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    phone = db.Column(db.String(20), nullable=True)

    # NEW FIELD (RBAC)
    role = db.Column(
        db.String(20),
        nullable=False,
        default="user"
    )

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # relationships
    orders = db.relationship("Order", backref="user", lazy=True)