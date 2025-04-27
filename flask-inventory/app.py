import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes import user1_routes, user2_routes
from auth import auth_routes

app = Flask(__name__, static_folder='inventory-frontend/build/static', template_folder='inventory-frontend/build')

CORS(app)

# Register blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(user1_routes, url_prefix="/user1")
app.register_blueprint(user2_routes, url_prefix="/user2")

# Serve the index.html file
@app.route('/')
def serve():
    return send_from_directory(app.template_folder, 'index.html')

# Serve static assets (JS, CSS, images)
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, path))

if __name__ == "__main__":
    app.run(debug=True)


