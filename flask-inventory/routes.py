from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import config

# Connect to User1 and User2 Databases
client1 = MongoClient(config.MONGO_URI_USER1)
client2 = MongoClient(config.MONGO_URI_USER2)
db1 = client1["inventory_db1"]
db2 = client2["inventory_db2"]
collection1 = db1["items"]
collection2 = db2["items"]

# Create Blueprints for User1 and User2
user1_routes = Blueprint("user1_routes", __name__)
user2_routes = Blueprint("user2_routes", __name__)

# 🔹 GET Items (Sorted by Expiry Date) - User1
@user1_routes.route("/items", methods=["GET"])
def get_items_user1():
    items = list(collection1.find({}, {"_id": 0}).sort("expiry_date", 1))  # Sorting by expiry date
    return jsonify(items)

# 🔹 Add Item - User1
@user1_routes.route("/items", methods=["POST"])
def add_item_user1():
    data = request.json
    collection1.insert_one(data)
    return jsonify({"message": "Item added for User1"}), 201

# 🔹 Delete Item - User1
@user1_routes.route("/items/<string:name>", methods=["DELETE"])
def delete_item_user1(name): 
    result = collection1.delete_one({"name": name})  
    if result.deleted_count == 0:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"message": "Item deleted for User1"}), 200

# 🔹 Update Item - User1
@user1_routes.route("/items/<string:name>", methods=["PUT"])
def update_item_user1(name):  
    data = request.json
    result = collection1.update_one({"name": name}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"message": "Item updated for User1"}), 200

# ========================================================

# 🔹 GET Items (Sorted by Expiry Date) - User2
@user2_routes.route("/items", methods=["GET"])
def get_items_user2():
    items = list(collection2.find({}, {"_id": 0}).sort("expiry_date", 1))  # Sorting by expiry date
    return jsonify(items)

# 🔹 Add Item - User2
@user2_routes.route("/items", methods=["POST"])
def add_item_user2():
    data = request.json
    collection2.insert_one(data)
    return jsonify({"message": "Item added for User2"}), 201

# 🔹 Delete Item - User2
@user2_routes.route("/items/<string:name>", methods=["DELETE"])
def delete_item_user2(name):  
    result = collection2.delete_one({"name": name})  
    if result.deleted_count == 0:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"message": "Item deleted for User2"}), 200

# 🔹 Update Item - User2
@user2_routes.route("/items/<string:name>", methods=["PUT"])
def update_item_user2(name):  
    data = request.json
    result = collection2.update_one({"name": name}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"message": "Item updated for User2"}), 200




