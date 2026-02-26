"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post_spot
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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

@api.route("/login", methods=["POST"])
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
                        'user': user_exist.serialize()}), 200
                        
    return jsonify({'error':'Invalid email or password'}), 401

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

    # DESCOMENTAR CUANDO SE CREE LA TABLA MEDIA SPOT 
    # media_spot = Media_Spot.query.filter_by(post_id=spot_id).all()
    # data["media"] = [item.serialize() for item in media_spot]
    return jsonify(data), 200



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
    
    if "latitud" in data:
        try:
            spot.latitud = float(data["latitud"])
        except (ValueError, TypeError):
            return jsonify({"msg": "Latitud inválida, debe ser un número"}), 400

    if "longitud" in data:
        try:
            spot.longitud = float(data["longitud"])
        except (ValueError, TypeError):
            return jsonify({"msg": "Longitud inválida, debe ser un número"}), 400

    if "valoracion" in data:
        spot.valoracion = data["valoracion"]

    db.session.commit()
    return jsonify(spot.serialize()), 200


@api.route("/spots", methods=["POST"])
@jwt_required()
def create_spot():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"msg": "No se han enviado datos"}), 400
    
    if "latitud" not in data or "longitud" not in data:
        return jsonify({"msg": "La latitud y longitud son obligatorias"}), 400

        #FALTA NOMBRE-DESCRIPCION-CATEGORIA-IMAGEN -- HAY QUE VER LO QUE VA EN LA TABLA MEDIOS
        
    try:
        new_spot = Post_spot(
            latitud=float(data.get("latitud")),
            longitud=float(data.get("longitud")),
            valoracion=data.get("valoracion", 0.0), 
            user_id=user_id 
        )

        db.session.add(new_spot)
        db.session.commit()
        return jsonify(new_spot.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar el spot", "error": str(e)}), 500
    

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
        
    return jsonify({"msg": "Spot eliminado exitosamente"}), 200

