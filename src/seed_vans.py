from app import app
from api.models import db, Vehicle, Media_vehicle

def setup_seed():
    with app.app_context():
        print("Iniciando el sembrado de datos...")

        vans_data = [
            {
                "brand": "Ford", "model": "Transit L2H2 Custom", "capacity": 3, "price_per_day": 105.0,
                "type_vehicle": "Gran Volumen", "available": True,
                "description": "Altura suficiente para estar de pie. Totalmente aislada con Kaiflex, doble batería y claraboya panorámica.",
                "media": ["https://i.imgur.com/fhJn7ow.png", "https://i.imgur.com/zn1GZn3.jpeg"]
            },
            {
                "brand": "Volkswagen", "model": "California T6.1", "capacity": 4, "price_per_day": 125.0,
                "type_vehicle": "Camper Media", "available": True,
                "description": "La joya de la corona. Techo elevable, cocina integrada y capacidad para dormir 4 personas. Ideal para parejas.",
                "media": ["https://i.imgur.com/RqUUd6u.png", "https://i.imgur.com/peNPKRo.png"]
            },
            {
                "brand": "Fiat", "model": "Ducato L3H2 Custom", "capacity": 3, "price_per_day": 110.0,
                "type_vehicle": "Gran Volumen", "available": True,
                "description": "Gran volumen con ducha interior con agua caliente, panel solar de 160W y cama fija de matrimonio.",
                "media": ["https://i.imgur.com/JcWcibM.jpeg", "https://i.imgur.com/7upJRfH.jpeg"]
            },
            {
                "brand": "Ford", "model": "Transit Nugget", "capacity": 5, "price_per_day": 95.5,
                "type_vehicle": "Camper Media", "available": True,
                "description": "Diseño con cocina en la parte trasera. Muy ágil para entrar en pueblos pequeños y parkings de playa.",
                "media": ["https://i.imgur.com/P3zgfWH.jpeg", "http://i.imgur.com/EQ1YmDP.jpeg"]
            },
            {
                "brand": "Volkswagen", "model": "Crafter L2H2 Edition", "capacity": 3, "price_per_day": 135.0,
                "type_vehicle": "Gran Volumen", "available": True,
                "description": "La furgoneta más versátil. Altura interior perfecta, baño compacto con ducha y muy ágil en carretera.",
                "media": ["https://i.imgur.com/zfPvtkW.png", "https://i.imgur.com/hZBwbMf.jpeg"]
            }
        ]

        vans_added = 0
        for item in vans_data:
            exists = Vehicle.query.filter_by(brand=item["brand"], model=item["model"]).first()

            if not exists:

                new_v = Vehicle(
                    brand=item["brand"],
                    model=item["model"],
                    description=item["description"],
                    capacity=item["capacity"],
                    type_vehicle=item["type_vehicle"],
                    price_per_day=item["price_per_day"],
                    available=item["available"]
                )
                db.session.add(new_v)
                db.session.flush()

                for img_url in item["media"]:
                    new_media = Media_vehicle(
                        car_id=new_v.car_id,
                        url_vehicle=img_url,
                        media_type="image"
                    )
                    db.session.add(new_media)

                vans_added += 1
                print(f"Añadida: {item['brand']} {item['model']}")
            else:
                print(f"Saltada (ya existe): {item['brand']} {item['model']}")

        try:
            db.session.commit()
            print(f"¡Proceso finalizado! Se añadieron {vans_added} furgonetas nuevas.")
        except Exception as e:
            db.session.rollback()
            print(f"Error al poblar la base de datos: {e}")

if __name__ == "__main__":

    setup_seed()