from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Vehicle
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

van = Blueprint('van', __name__)

CORS(van)

@van.route('/vehicles', methods=['POST'])

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