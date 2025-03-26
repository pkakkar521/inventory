from flask import Flask
from flask_cors import CORS
from routes import user1_routes, user2_routes
from auth import auth_routes

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(user1_routes, url_prefix="/user1")
app.register_blueprint(user2_routes, url_prefix="/user2")

if __name__ == "__main__":
    app.run(debug=True)
