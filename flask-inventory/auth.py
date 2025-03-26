from flask import Blueprint, request, jsonify
import jwt
import datetime
import config

auth_routes = Blueprint("auth_routes", __name__)

# Predefined users (No registration needed)
USERS = {
    "user1": {"password": "pass123", "role": "user1"},
    "user2": {"password": "pass456", "role": "user2"},
}

SECRET_KEY = "your_secret_key"  

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # Check credentials
    if username in USERS and USERS[username]["password"] == password:
        token = jwt.encode(
            {"user": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            SECRET_KEY,
            algorithm="HS256",
        )
        return jsonify({"token": token, "role": USERS[username]["role"]})

    return jsonify({"message": "Invalid credentials"}), 401
