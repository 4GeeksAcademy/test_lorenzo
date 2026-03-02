from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Numeric, Integer, ForeignKey, Float, Text, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import date
from decimal import Decimal

db = SQLAlchemy()

favorite_spot = Table(
    "favorire_spot",
    db.metadata,
    Column("id", db.Integer, primary_key=True),
    Column("User_id", ForeignKey("user.id"), nullable=False),
    Column("Spot_id", ForeignKey("post_spot.spot_id"), nullable=False)
)

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

    coment: Mapped[list["Coment"]] = relationship(back_populates="user_coment")
    post_spot: Mapped[list["Post_spot"]] = relationship(back_populates="user_post")
    booking: Mapped[list["Booking"]] = relationship(back_populates="user_booking")
    review_user: Mapped[list["Review_van"]] = relationship(back_populates="user_id_review")
    fav_spot: Mapped[list["Post_spot"]] = relationship(
        "Post_spot",
        secondary =  favorite_spot,
        back_populates= "fav_spot_by"
    )

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
    price_per_day: Mapped[float] = mapped_column(Numeric(precision=10, scale=2), nullable=False)
    available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
   
    booking: Mapped[list["Booking"]] = relationship(back_populates="van_booking")
    review_car: Mapped[list["Review_van"]] = relationship(back_populates="car_id_review")

    def serialize(self):
        return {
            "car_id": self.car_id,
            "brand":self.brand,
            "model": self.model,
            "description": self.description,
            "capacity": self.capacity,
            "type_vehicle": self.type_vehicle,
            "price_per_day": self.price_per_day,
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
    
    user_post : Mapped["User"] = relationship(back_populates="post_spot")
    post: Mapped[list["Coment"]] = relationship(back_populates="post_coment")
    spot_media: Mapped[list["Media_spot"]] =relationship(back_populates="media_spot")
    fav_spot_by: Mapped[list["User"]] = relationship(
        "User",
        secondary = favorite_spot,
        back_populates = "fav_spot"
    )

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

    media_spot: Mapped["Post_spot"] = relationship(back_populates="spot_media")

    def serialize(self):
        return {
            "media_id": self.media_id,
            "post_id": self.post_id,
            "url": self.url,
            "media_type": self.media_type,
        }


# media vehicle tabla suplementaria,(mover junto con el modelo de vehiculo )

class Media_vehicle(db.Model):
    media_vehicle_id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("vehicle.car_id"), nullable=False)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    media_type: Mapped[str] = mapped_column(String(50), nullable=True) 

    def serialize(self):
        return {
            "media_vehicle_id": self.media_vehicle_id,
            "car_id": self.car_id,
            "url_vehicle": self.url_vehicle,
            "media_type": self.media_type,
        }

class Booking(db.Model):
    booking_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    car_id: Mapped[int] = mapped_column(ForeignKey("vehicle.car_id"), nullable=False)
    start_date: Mapped[date] = mapped_column(db.Date, nullable=False)
    end_date: Mapped[date] = mapped_column(db.Date, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending") # pending, confirmed, cancelled
    total_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    user_booking: Mapped["User"] = relationship(back_populates="booking")
    van_booking: Mapped["Vehicle"] = relationship(back_populates="booking")
    review_booking: Mapped[list["Review_van"]] = relationship(back_populates="bookking_id_review")

    def serialize(self):
        return {
            "booking_id": self.booking_id,
            "user_id": self.user_id,
            "car_id": self.car_id,
            "start_date": self.start_date.isoformat(), # isoformat lo convierte en "AAAA-MM-DD"
            "end_date": self.end_date.isoformat(),
            "status": self.status,
            "total_price": float(self.total_price) # aqui se pasa a float para que el JSON lo acepte 
        }
    
class Coment (db.Model):
    coment_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False) #FK
    spot_id: Mapped[int] = mapped_column(ForeignKey("post_spot.spot_id"), nullable=False) #FK
    rating: Mapped[int] = mapped_column(nullable=False)
    coment_text: Mapped[str] = mapped_column(String(450), nullable=False)

    user_coment : Mapped["User"] = relationship(back_populates="coment")
    post_coment : Mapped["Post_spot"] = relationship(back_populates="post")

    def serialize(self):
        return{
        "coment_id": self.coment_id,
        "user_id": self.user_id,
        "spot_id": self.spot_id,
        "rating": self.rating,
        "coment_text": self.coment_text
        }
    
class Review_van(db.Model):
    review_van_id: Mapped[int] = mapped_column(primary_key = True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable= False)
    bookking_id: Mapped[int] = mapped_column(ForeignKey("booking.booking_id"), nullable=False)
    car_id: Mapped[int] = mapped_column(ForeignKey("vehicle.car_id"), nullable= False)
    coment_review: Mapped[str]= mapped_column(String(450), nullable=True)
    rating_review: Mapped[int]= mapped_column(nullable=False)

    user_id_review: Mapped["User"] = relationship(back_populates="review_user")
    car_id_review: Mapped["Vehicle"] = relationship(back_populates="review_car")
    bookking_id_review: Mapped["Booking"] = relationship(back_populates="review_booking")

    def serialize(self):
        return{
            "review_van_id": self.review_van_id,
            "user_id": self.user_id,
            "booking_id": self.bookking_id,
            "car_id": self.car_id,
            "coment_review": self.coment_review,
            "rating_review": self.rating_review
        }

