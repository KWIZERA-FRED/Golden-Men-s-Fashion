import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:

    # ======================
    # SECURITY
    # ======================
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")

    # ======================
    # DATABASE
    # ======================
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ======================
    # JWT CONFIG
    # ======================
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # ======================
    # FILE UPLOADS
    # ======================
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads")
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB

    # ======================
    # EMAIL (PRODUCTION SAFE)
    # ======================
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = True

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")