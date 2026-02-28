from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Vehicle
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

van = Blueprint('van', __name__)

CORS(van)

@van.route('/vehicles', methods=['POST'])
@jwt_required()

def create_vehicle():
    data = request.get_json()

    brand =data.get("brand")
    model = data.get("model")
    description = data.get("description")
    capacity =data.get("capacity")
    type_vehicle = data.get("type_vehicle")
    price_per_day=data.get("price_per_day")
    available =data.get("available", True)

    if not brand or not model or not description or not capacity or not type_vehicle:
        return jsonify({"error": "brand, model, description, capacity and type of vehicle  are required"}), 400 
    
    new_vehicle =Vehicle(
        brand=brand,
        model=model,
        description=description,
        capacity=capacity,
        type_vehicle=type_vehicle,
        price_per_day=price_per_day,
        available=available
        
    )

    db.session.add(new_vehicle)
    db.session.commit()

    return jsonify({
        "msg": "vehicle craeted successfully"}),201

@van.route('/vehicles', methods=['GET'])
@jwt_required()
def get_all_vehicles():
    vehicles = Vehicle.query.all()
    result =[vehicle.serialize() for vehicle in vehicles]
    return jsonify(result), 200

@van.route('vehicles/<int:vehicle_id>', methods=['GET'])
@jwt_required()
def get_vehicle(vehicle_id):
    vehicle =Vehicle.query.get(vehicle_id)

    if vehicle is None:
        return jsonify({"msg":"Vehicle not found"}), 404
    return  jsonify(vehicle.serialize()), 200


@van.route('vehicle/<int:vehicle_id>', methods=['PUT'])
@jwt_required()
def updat_vehicle(vehicle_id):
    data = request.get_json()
    vehicle = Vehicle.query.get(vehicle_id)

    if vehicle is None:
        return jsonify({"msg":"The requested vehicle does not exist"}), 404
    
    if "brand" in data:
        vehicle.brand = data["brand"]
    if "model" in data:
        vehicle.model =data["model"]
    if "description "in data:
        vehicle.description = data=["description"]
    if "type_vehicle" in data :
        vehicle.type_vehicle = data["type_vehicle"]
    if "available" in data:
        vehicle.available = data["available"]
    if "capacity" in data :
        vehicle.capacity = data["capacity"]
    if "price_per_day" in data :
        vehicle.price_per_day = data["price_per_day"]


    db.session.commit()
    return jsonify(vehicle.serialize()), 200
    

@van.route('vehicle/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    vehicle =Vehicle.query.get(vehicle_id)

    if vehicle is None:
        return jsonify ({"msg": "Vehivle not found"}), 404
    
    db.session.delete(vehicle)
    db.session.commit()

    return jsonify({"msg": "Vehicle deleterd succesfelly"}),  200


