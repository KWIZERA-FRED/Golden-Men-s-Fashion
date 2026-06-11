import os 
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv() #“Read the .env file and make its values available as environment variables.”

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:

    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False  

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)


    # upload settings
    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "..",
        "uploads"
    )
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB

    #E-mail config
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True

    MAIL_USERNAME = "your_email@gmail.com"
    MAIL_PASSWORD = "your_google_app_password"

    MAIL_DEFAULT_SENDER = "your_email@gmail.com"

     