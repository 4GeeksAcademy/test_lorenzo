from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Coment, Post_spot
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

coment = Blueprint('coment_bp', __name__)

CORS(coment)

@coment.route("/coment", methods=["GET"])
def get_coment():

    coments = db.session.execute(select(Coment)).scalars().all()
    if not coments:
        return jsonify({"error": "There are no comments"}),400
    
    response = [coment.serialize() for coment in coments]
    return jsonify(response), 200

@coment.route("/new", methods=['POST'])
@jwt_required()
def coment_user():

    user_id = get_jwt_identity()
    
    data = request.get_json()
    coment = data.get("coment")
    rating = data.get("rating")
    spot_id = data.get("spot_id")

    if not rating or not coment:
        return({"error":"Required coment and rating"}), 400
    
    user_exist = db.session.execute(select(User).where(
        User.id == user_id )).scalar_one_or_none()
    
    if not user_exist:
        return jsonify({"error": "Uverified user"}), 400
    
    spot_exist = db.session.get(Post_spot, spot_id)

    if not spot_exist:
        return jsonify({"error": "Spot not found"}), 404
    
    new_coment = Coment(
        user_id=user_id,
        spot_id=spot_id, 
        coment_text=coment, 
        rating=rating)
    
    db.session.add(new_coment)
    db.session.commit()
    return jsonify({"msg": "Coment create succesfully"}), 201

@coment.route("/edit/<int:coment_id>", methods=["PUT"])
@jwt_required()
def edit_coment(coment_id):

    user_id = get_jwt_identity()
    data = request.get_json()
    new_coment = data.get("coment")
    new_rating = data.get("rating")

    coment = db.session.execute(select(Coment).where(Coment.coment_id == coment_id)).scalar_one_or_none()

    if not coment:
        return jsonify({"error": "There are no comment"}), 400
    
    if int(coment.user_id) != int(user_id):
        return jsonify({"error": "Uverified user"}), 400

    if new_coment:
        coment.coment_text = new_coment
    if new_rating:
        coment.rating = new_rating

    db.session.commit()
    return jsonify({"msg":"Edit coment succesfully"}), 200

@coment.route("/del/<int:coment_id>", methods=["DELETE"])
@jwt_required()
def delete_coment(coment_id):

    user_id = get_jwt_identity()
    coment = db.session.execute(select(Coment).where(Coment.coment_id == coment_id)).scalar_one_or_none()

    if not coment:
        return jsonify({"error": "There are no comment"}), 400
    
    if int(coment.user_id) != int(user_id):
        return jsonify({"error": "Uverified user"}), 400
    
    db.session.delete(coment)
    db.session.commit()

    return jsonify({"msg":"Delete coment succesfully"}),200