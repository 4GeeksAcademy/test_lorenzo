from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Numeric, Integer, ForeignKey, Float, Text
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import generate_password_hash, check_password_hash


db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
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


class Post_spot(db.Model):
    spot_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    longitude: Mapped[float] = mapped_column(
        Numeric(precision=9, scale=6), nullable=True)
    latitude: Mapped[float] = mapped_column(
        Numeric(precision=9, scale=6), nullable=True)
    rating: Mapped[float] = mapped_column(
        Numeric(precision=3, scale=2), nullable=True)
    is_sleepable: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=True)
    has_water: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=True)
    has_waste_dump: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=True)

    def serialize(self):
        return {
            "spot_id": self.spot_id,
            "user_id": self.user_id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "longitude": float(self.longitude) if self.longitude is not None else 0.0,
            "latitude": float(self.latitude) if self.latitude is not None else 0.0,
            "rating": float(self.rating) if self.rating is not None else None,
            "is_sleepable": self.is_sleepable,
            "has_water": self.has_water,
            "has_waste_dump": self.has_waste_dump
        }

class Media_spot(db.Model):
    media_id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("post_spot.spot_id"), nullable=False)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    media_type: Mapped[str] = mapped_column(String(50), nullable=True) 

    def serialize(self):
        return {
            "media_id": self.media_id,
            "post_id": self.post_id,
            "url": self.url,
            "media_type": self.media_type,
        }
