import os 
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv() #“Read the .env file and make its values available as environment variables.”


class Config:

    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False  

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)