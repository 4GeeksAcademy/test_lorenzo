from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Numeric, Integer, ForeignKey
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

class Post_spot(db.Model):
    spot_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    longitud: Mapped[float] = mapped_column(Numeric(precision=9, scale=6), nullable=False)
    latitud: Mapped[float] = mapped_column(Numeric(precision=9, scale=6), nullable=False)
    valoracion: Mapped[float] = mapped_column(Numeric(precision=3, scale=2), nullable=True)

    def serialize(self):
        return {
            "spot_id": self.spot_id,
            "user_id": self.user_id,
            "longitud": float(self.longitud),
            "latitud": float(self.latitud),
            "valoracion": float(self.valoracion) if self.valoracion else None
        }