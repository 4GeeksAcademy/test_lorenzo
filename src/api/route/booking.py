from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Vehicle, Booking
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

booking = Blueprint('booking_bp', __name__)

CORS(booking)


@booking.route('/add', methods=['POST'])
# @jwt_required()
def create_booking():
    data = request.get_json()

    required_fields = ["user_id", "car_id", "start_date", "end_date"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    vehicle = Vehicle.query.get(data['car_id'])
    if not vehicle:
        return jsonify({"error": "El vehículo no existe"}), 400

    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

    if start_date >= end_date:
        return jsonify({"msg": "La fecha de inicio debe ser anterior a la final"}), 400
   
    overlap = Booking.query.filter(
        Booking.car_id == data['car_id'],
        Booking.status != "cancelled",
        Booking.start_date < end_date, 
        Booking.end_date > start_date      
    ).first()

    if overlap:
        return jsonify({"error": "El vehiculo ya esta reservado en esas fechas"}), 409

    days = (end_date - start_date).days
    calculated_price = days * vehicle.price_per_day

    new_booking = Booking(
        user_id = data['user_id'],
        car_id = data['car_id'],
        start_date = start_date,
        end_date = end_date,
        total_price = calculated_price,
        status = data.get("status")
    )

    db.session.add(new_booking)
    db.session.commit()

    return jsonify(new_booking.serialize()), 201

@booking.route('/all', methods=['GET'])
# @jwt_required()
def get_all_bookings():
    all_bookings = Booking.query.all()

    if not all_bookings:
        return jsonify({"msg": "No hay ninguna reserva registrada en el sistema"}), 200

    results = [booking.serialize() for booking in all_bookings]

    return jsonify({
        "total_bookings": len(results),
        "bookings": results
    }), 200



@booking.route('/user/<int:user_id>', methods=['GET'])
# @jwt_required()
def get_user_bookings(user_id):
    user_bookings = Booking.query.filter_by(user_id=user_id).all()

    if not user_bookings:
        return jsonify({"msg": "Este usuario no tiene reservas aún", "bookings": []}), 200

    results = [booking.serialize() for booking in user_bookings]
    return jsonify(results), 200

@booking.route('/cancel/<int:booking_id>', methods=['PUT'])
# @jwt_required()
def cancel_booking(booking_id):
    booking_to_cancel = Booking.query.get(booking_id)

    if not booking_to_cancel:
        return jsonify({"error": "La reserva no existe"}), 404

    if booking_to_cancel.status == "cancelled":
        return jsonify({"error": "Esta reserva ya fue cancelada anteriormente"}), 400

    booking_to_cancel.status = "cancelled"
    db.session.commit()
    return jsonify({"msg": "Reserva cancelada con éxito", "booking": booking_to_cancel.serialize()}), 200
