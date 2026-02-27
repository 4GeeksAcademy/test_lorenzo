"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth = Blueprint('auth', __name__)

# Allow CORS requests to this API
CORS(auth)

# -------------------RUTAS MODELO USER---------------------

@auth.route("/signup", methods=['POST'])
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


@auth.route("/login", methods=['POST'])
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



@auth.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()
    user_exist = db.session.get(User, int(user_id))

    if not user_exist:
        return jsonify({'error': 'Not found'}), 400
    return jsonify(user_exist.serialize())


@auth.route("/edit", methods =["PUT"])
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
