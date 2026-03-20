from flask import Flask, request, jsonify,  Blueprint, current_app
from api.models import db, User, Vehicle, Booking
from flask_cors import CORS
from flask_jwt_extended import jwt_required
from datetime import datetime
from flask_mail import Message

booking = Blueprint('booking_bp', __name__)

CORS(booking)


@booking.route('/add', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()

    required_fields = ["user_id", "car_id", "start_date", "end_date"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    vehicle = Vehicle.query.get(data['car_id'])
    if not vehicle:
        return jsonify({"error": "El vehículo no existe"}), 400

    start_date = datetime.strptime(data['start_date'], '%d-%m-%Y').date()
    end_date = datetime.strptime(data['end_date'], '%d-%m-%Y').date()

    if start_date >= end_date:
        return jsonify({"error": "La fecha de inicio debe ser anterior a la final"}), 400

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
        user_id=data['user_id'],
        car_id=data['car_id'],
        start_date=start_date,
        end_date=end_date,
        total_price=calculated_price,
        status=data.get("status")
    )

    db.session.add(new_booking)
    db.session.commit()

    user = User.query.get(data["user_id"])

    if user.email:
        mail = current_app.extensions['mail']
        msg = Message(
            subject=f"Reserva Confirmada: {vehicle.model}",
            sender="admin@rentacar.com",
            recipients=[user.email]
        )

        msg.html = f'''
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 40px 0; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">¡Reserva Confirmada!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 18px; margin-top: 0;">Hola <strong>{user.user_name}</strong>,</p>
                    <p style="line-height: 1.6; color: #666;">Tu coche ya te está esperando. Hemos procesado tu reserva correctamente. Aquí tienes los detalles de tu próximo viaje:</p>
                    <div style="background-color: #f4f7f6; border-left: 4px solid #3498db; padding: 20px; margin: 25px 0;">
                        <p style="margin: 5px 0;"><strong>Fecha de recogida:</strong> {start_date:%d/%m/%Y}</p>
                        <p style="margin: 5px 0;"><strong>Fecha de entrega:</strong> {end_date:%d/%m/%Y}</p>
                        <p style="margin: 15px 0 5px 0; font-size: 20px; color: #2c3e50;">
                            <strong>Total a pagar: <span style="color: #27ae60;">{calculated_price}€</span></strong>
                        </p>
                    </div>
                    <p style="line-height: 1.6; color: #666;">Recuerda llevar tu DNI y carnet de conducir vigente al momento de la recogida.</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="font-style: italic; color: #999; font-size: 14px;">Gracias por confiar en nosotros para acompañarte en tu viaje.</p>
                    </div>
                </div>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    <p style="margin: 0;">© 2026 RentACar España - Calle Falsa 123, Madrid.</p>
                </div>
            </div>
        </div>'''

        mail.send(msg)
        print("Correo enviado a Mailtrap")

    return jsonify({"msg": "Reserva realizada con exito!!", "booking": new_booking.serialize()}), 201

@booking.route('/all', methods=['GET'])
@jwt_required()
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
@jwt_required()
def get_user_bookings(user_id):
    user_bookings = Booking.query.filter(
        Booking.user_id == user_id,
        Booking.status != "cancelled"
    ).all()

    if not user_bookings:
        return jsonify({"msg": "Este usuario no tiene reservas aún", "bookings": []}), 200

    results = [booking.serialize() for booking in user_bookings]
    return jsonify(results), 200


@booking.route('/cancel/<int:booking_id>', methods=['PUT'])
@jwt_required()
def cancel_booking(booking_id):
    booking_to_cancel = Booking.query.get(booking_id)

    if not booking_to_cancel:
        return jsonify({"error": "La reserva no existe"}), 404

    if booking_to_cancel.status == "cancelled":
        return jsonify({"error": "Esta reserva ya fue cancelada anteriormente"}), 400

    booking_to_cancel.status = "cancelled"
    db.session.commit()
    return jsonify({"msg": "Reserva cancelada con éxito", "booking": booking_to_cancel.serialize()}), 200
