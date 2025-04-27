import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes import user1_routes, user2_routes
from auth import auth_routes

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")

CORS(app)

# Register blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(user1_routes, url_prefix="/user1")
app.register_blueprint(user2_routes, url_prefix="/user2")

# Serve the React app
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.template_folder, path)):
        return send_from_directory(app.template_folder, path)
    else:
        return send_from_directory(app.template_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)




