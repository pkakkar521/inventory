from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from routes import user1_routes, user2_routes
from auth import auth_routes

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

# Register blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(user1_routes, url_prefix="/user1")
app.register_blueprint(user2_routes, url_prefix="/user2")

# Route for frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

# Optional: Catch all other frontend routes (for React Router)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
