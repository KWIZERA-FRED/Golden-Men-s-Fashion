from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True) #Creates your Flask app using create_app() and runs a local development server.