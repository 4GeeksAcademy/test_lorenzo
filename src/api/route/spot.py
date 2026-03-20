from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post_spot, Media_spot, Coment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

spot = Blueprint('spot', __name__)

CORS(spot)

@spot.route("/spots", methods=["GET"])
def get_all_spots():
    spots = Post_spot.query.all()
    response = [spot.serialize() for spot in spots]
    return jsonify(response), 200


@spot.route("/spots/<int:spot_id>", methods=["GET"])
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


@spot.route("/spots", methods=["POST"])
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
        address=data.get("address"), 
        city=data.get("city"),       
        phone_formatted=data.get("phoneFormatted"),
        latitude=float(data.get("latitude")),
        longitude=float(data.get("longitude")),
        rating=data.get("rating"),
        is_sleepable=data.get("is_sleepable", True),
        has_water=data.get("has_water", False),
        has_waste_dump=data.get("has_waste_dump", False),
        has_electricity=data.get("has_electricity", False)
    )

    db.session.add(new_spot)
    db.session.flush()
    
    coment_text = data.get("coment_text")
    if coment_text:
        new_coment = Coment(
            user_id=user_id,
            spot_id=new_spot.spot_id,
            coment_text=coment_text,
            rating=data.get("rating", 5)
        )
        db.session.add(new_coment)
    
    image_url = data.get("image_url")
    if image_url:
        new_media = Media_spot(
            post_id=new_spot.spot_id,
            url=image_url,
            media_type="image"
        )
        db.session.add(new_media)

    db.session.commit()
    return jsonify(new_spot.serialize()), 201


@spot.route("/spots/<int:spot_id>", methods=["PUT"])
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


@spot.route("/spots/<int:spot_id>", methods=["DELETE"])
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

@spot.route("/spots/<int:spot_id>/media", methods=["POST"])
@jwt_required()
def add_media_to_spot(spot_id):
    data = request.get_json()
    
    spot_obj = Post_spot.query.get(spot_id)
    if spot_obj is None:
        return jsonify({"msg": "Ese spot no existe"}), 404
        
    if not data or "url" not in data:
        return jsonify({"msg": "Falta la URL de la imagen"}), 400
        
    new_media = Media_spot(
        post_id=spot_id,        
        url=data.get("url"),    
        media_type=data.get("media_type", "image")
    )
    
    db.session.add(new_media)
    db.session.commit()
    
    return jsonify(new_media.serialize()), 201

@spot.route("/spots/<int:spot_id>/media", methods=["GET"])
def get_spot_media(spot_id):
    media_list = Media_spot.query.filter_by(post_id=spot_id).all()
    
    return jsonify([item.serialize() for item in media_list]), 200

@spot.route("/media/<int:media_id>", methods=["DELETE"])
@jwt_required()
def delete_media(media_id):
    media = Media_spot.query.get(media_id)
    
    if media is None:
        return jsonify({"msg": "La foto no existe"}), 404

    db.session.delete(media)
    db.session.commit()
    
    return jsonify({"msg": "Foto eliminada correctamente"}), 200

@spot.route("/favorites/<int:spot_id>", methods=["POST"])
@jwt_required()
def add_favorite(spot_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    spot_obj = Post_spot.query.get(spot_id)

    if not spot_obj:
        return jsonify({"msg": "Spot no encontrado"}), 404

    if spot_obj not in user.fav_spot:
        user.fav_spot.append(spot_obj)
        db.session.commit()
        return jsonify({"msg": "Añadido a favoritos"}), 200
    
    return jsonify({"msg": "Ya estaba en favoritos"}), 400

@spot.route("/favorites/<int:spot_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(spot_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    spot_obj = Post_spot.query.get(spot_id)

    if spot_obj in user.fav_spot:
        user.fav_spot.remove(spot_obj)
        db.session.commit()
        return jsonify({"msg": "Eliminado de favoritos"}), 200
    
    return jsonify({"msg": "No estaba en favoritos"}), 400

@spot.route("/favorites/<int:spot_id>/check", methods=["GET"])
@jwt_required()
def check_favorite(spot_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    is_fav = any(s.spot_id == spot_id for s in user.fav_spot)
    return jsonify({"isFavorite": is_fav}), 200

@spot.route("/favorites", methods=["GET"])
@jwt_required()
def get_user_favorites():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    favorites = [s.serialize() for s in user.fav_spot]
    return jsonify(favorites), 200
