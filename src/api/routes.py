"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Vehicle
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()
    email= data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Required Email and password"}), 400
    
    user_exist= db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user_exist:
        return jsonify({"error":"Email already exist"}), 400
    
    new_user = User(email = email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg":"User create succesfully"}), 201

@api.route("/login", methods=['POST'])
def login():
    data= request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Required Email and password"}), 400
    
    user_exist= db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user_exist is None:
        return jsonify({"error": "User not found"}), 404
    
    if user_exist.check_password(password):
        access_token = create_access_token(identity=str(user_exist.id))
        return jsonify({'msg':'Login successfully',
                        'token': access_token,
                        'user': user_exist.serialize()}), 200,
                        
    return jsonify({'error':'Invalid email or password'}), 401


#Endpoints Vehicle

@api.route('/vehicles', methods=['POST'])

def create_vehicle():
    data = request.get_json()

    brand =data.get("brand")
    model = data.get("model")
    description = data.get("description")
    capacity =data.get("capacity")
    type_vehicle = data.get("type_vehicle")
    price_per_day=data.get("price_per_day")
    images =data.get("images")
    available =data.get("available", True)

    if not brand or not model or not description or not capacity or not type_vehicle or not images:
        return jsonify({"error": "brand, model, description, capacity, type of vehicle and images are required"}), 400 
    
    new_vehicle =Vehicle(
        brand=brand,
        model=model,
        description=description,
        capacity=capacity,
        type_vehicle=type_vehicle,
        price_per_day=price_per_day,
        images=images,
        available=available
        
    )

    db.session.add(new_vehicle)
    db.session.commit()

    return jsonify({
        "msg": "vehicle craeted successfully"}),201