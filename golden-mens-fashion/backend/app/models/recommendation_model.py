from app.extensions import db
from sqlalchemy.sql import func


class RecommendationInteraction(db.Model):

    __tablename__ = "recommendation_interactions"


    interaction_id = db.Column(
        db.Integer,
        primary_key=True
    )


    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id"),
        nullable=False,
        index=True
    )


    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.product_id"),
        nullable=False,
        index=True
    )


    interaction_type = db.Column(
        db.String(30),
        nullable=False
    )


    weight = db.Column(
        db.Integer,
        default=1
    )


    created_at = db.Column(
        db.DateTime,
        server_default=func.now()
    )


    def to_dict(self):

        return {

            "interaction_id": self.interaction_id,

            "user_id": self.user_id,

            "product_id": self.product_id,

            "interaction_type": self.interaction_type,

            "weight": self.weight,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            )
        }