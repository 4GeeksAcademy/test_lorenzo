from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import generate_password_hash, check_password_hash


db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=True)
    last_name: Mapped[str] = mapped_column(String(120), nullable=True)
    phone: Mapped[int] = mapped_column(unique=True, nullable=True)
    address: Mapped[str] = mapped_column(String(120), nullable=True)
    # is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "phone": self.phone,
            "address": self.address,
            # "is_active": self.is_active
            # do not serialize the password, its a security breach
        }

class Vehicle(db.Model):
    car_id: Mapped[int] = mapped_column(primary_key=True)
    brand: Mapped[str] = mapped_column(String(120), nullable=False)
    model: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    type_vehicle: Mapped[str] = mapped_column(String(120), nullable=False)
    price_per_day: Mapped[int] = mapped_column(Integer, nullable=False)
    images: Mapped[str] = mapped_column(String(600), nullable=False)
    available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
   

    def serialize(self):
        return {
            "car_id": self.car_id,
            "brand":self.brand,
            "model": self.model,
            "description": self.description,
            "capacity": self.capacity,
            "type_vehicle": self.type_vehicle,
            "price_per_day": self.price_per_day,
            "images": self.images,
            "available": self.available
        }
    
# Modelo de Media_vehicle

