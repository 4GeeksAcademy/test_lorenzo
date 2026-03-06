"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post_spot, Media_spot
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# -------------------RUTAS MODELO USER---------------------

@api.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Required Email and password"}), 400

    user_exist = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()

    if user_exist:
        return jsonify({"error": "Email already exist"}), 400

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User create succesfully"}), 201


@api.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Required Email and password"}), 400

    user_exist = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()

    if user_exist is None:
        return jsonify({"error": "User not found"}), 404

    if user_exist.check_password(password):
        access_token = create_access_token(identity=str(user_exist.id))
        return jsonify({'msg': 'Login successfully',
                        'token': access_token,
                        'user': user_exist.serialize()}), 200,
                        
    return jsonify({'error':'Invalid email or password'}), 401



@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()
    user_exist = db.session.get(User, int(user_id))

    if not user_exist:
        return jsonify({'error': 'Not found'}), 400
    return jsonify(user_exist.serialize())


@api.route("/edit", methods =["PUT"])
@jwt_required()
def edit_profile():

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    data = request.get_json()
    new_password = data.get("password")
    new_name = data.get("name")
    new_last_name = data.get("last_name")
    new_phone = data.get("phone")
    new_address = data.get("address")

    if new_password:
        user.set_password(new_password)
    if new_name:
        user.name = new_name
    if new_last_name:
        user.last_name = new_last_name
    if new_phone:
        user.phone = new_phone
    if new_address:
        user.address = new_address

    db.session.commit()
    return jsonify({'msg': 'Save change successfully'}), 201

# -------------------RUTAS MODELO SPOT---------------------

@api.route("/spots", methods=["GET"])
def get_all_spots():
    spots = Post_spot.query.all()
    response = [spot.serialize() for spot in spots]
    return jsonify(response), 200


@api.route("/spots/<int:spot_id>", methods=["GET"])
def get_spot_by_id(spot_id):
    spot = Post_spot.query.get(spot_id)
    if spot is None:
        return jsonify({"msg": "El lugar solicitado no existe"}), 404

    data = spot.serialize()
    user = User.query.get(spot.user_id)

    if user:
        data["userName"] = user.name
    else:
        data["userName"] = "Usuario desconocido"

    media_list = Media_spot.query.filter_by(post_id=spot_id).all()
    data["media"] = [item.serialize() for item in media_list]
    return jsonify(data), 200


@api.route("/spots", methods=["POST"])
@jwt_required()
def create_spot():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"msg": "No se han enviado datos"}), 400

    required_fields = ["name", "category", "latitude", "longitude"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"msg": f"El campo {field} es obligatorio"}), 400

    new_spot = Post_spot(
        user_id=user_id,
        name=data.get("name"),
        category=data.get("category"),
        description=data.get("description"),
        latitude=float(data.get("latitude")),
        longitude=float(data.get("longitude")),
        rating=data.get("rating"),
        is_sleepable=data.get("is_sleepable", True),
        has_water=data.get("has_water", False),
        has_waste_dump=data.get("has_waste_dump", False)
    )

    db.session.add(new_spot)
    db.session.commit()
    return jsonify(new_spot.serialize()), 201


@api.route("/spots/<int:spot_id>", methods=["PUT"])
@jwt_required()
def update_spot(spot_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    spot = Post_spot.query.get(spot_id)

    if spot is None:
        return jsonify({"msg": "El lugar solicitado no existe"}), 404

    if str(spot.user_id) != str(current_user_id):
        return jsonify({"msg": "No tienes permiso para editar este spot"}), 403

    if "name" in data:
        spot.name = data["name"]
    if "category" in data:
        spot.category = data["category"]
    if "description" in data:
        spot.description = data["description"]

    if "latitude" in data:
        try:
            spot.latitude = float(data["latitude"])
        except (ValueError, TypeError):
            return jsonify({"msg": "Latitude inválida, debe ser un número"}), 400

    if "longitude" in data:
        try:
            spot.longitude = float(data["longitude"])
        except (ValueError, TypeError):
            return jsonify({"msg": "Longitude inválida, debe ser un número"}), 400

    if "rating" in data:
        spot.rating = data["rating"]
    if "is_sleepable" in data:
        spot.is_sleepable = data["is_sleepable"]
    if "has_water" in data:
        spot.has_water = data["has_water"]
    if "has_waste_dump" in data:
        spot.has_waste_dump = data["has_waste_dump"]

    db.session.commit()
    return jsonify(spot.serialize()), 200


@api.route("/spots/<int:spot_id>", methods=["DELETE"])
@jwt_required()
def delete_spot(spot_id):
    current_user_id = get_jwt_identity()
    spot = Post_spot.query.filter_by(spot_id=spot_id).first()

    if spot is None:
        return jsonify({"msg": "El spot no existe"}), 404

    if str(spot.user_id) != str(current_user_id):
        return jsonify({"msg": "No tienes permiso para borrar este spot. No eres el dueño"}), 403

    db.session.delete(spot)
    db.session.commit()

    return jsonify({"msg": "Spot eliminado correctamente"}), 200

# -------FIN DE RUTAS SPOTS-------

# -------------------RUTAS MODELO MEDIA-SPOT---------------------

@api.route("/spots/<int:spot_id>/media", methods=["POST"])
@jwt_required()
def add_media_to_spot(spot_id):
    data = request.get_json()
    
    spot = Post_spot.query.get(spot_id)
    if spot is None:
        return jsonify({"msg": "Ese spot no existe"}), 404
        
    if "url" not in data:
        return jsonify({"msg": "Tienes que poner una URL para la foto"}), 400
        
    new_media = Media_spot(
        post_id=spot_id,        
        url=data.get("url"),    
        media_type=data.get("media_type", "image")
    )
    
    db.session.add(new_media)
    db.session.commit()
    
    return jsonify(new_media.serialize()), 201

@api.route("/spots/<int:spot_id>/media", methods=["GET"])
def get_spot_media(spot_id):
    media_list = Media_spot.query.filter_by(post_id=spot_id).all()
    
    return jsonify([item.serialize() for item in media_list]), 200

@api.route("/media/<int:media_id>", methods=["DELETE"])
@jwt_required()
def delete_media(media_id):
    media = Media_spot.query.get(media_id)
    
    if media is None:
        return jsonify({"msg": "La foto no existe"}), 404

    db.session.delete(media)
    db.session.commit()
    
    return jsonify({"msg": "Foto eliminada correctamente"}), 200

# -------FIN DE RUTAS MEDIA - SPOTS-------


# --------RUTAS VEHICULOS ------------

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