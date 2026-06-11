from flask_mail import Message

from app.extensions import mail


def send_order_email(user_email, order_id, total):

    msg = Message(
        subject="Order Confirmation",
        recipients=[user_email]
    )

    msg.body = f"""
Hello,

Your order #{order_id} has been placed successfully.

Total Amount: ${total}

Thank you for shopping with us.
"""

    mail.send(msg)