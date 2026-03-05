from app import app
from api.models import db, User, Post_spot 

CAMPER_SPOTS = [
    {
        "name": "Área de Autocaravanas de Vitoria-Gasteiz",
        "category": "campground", 
        "description": "Área municipal gratuita, muy amplia y asfaltada. Una de las mejores de España para hacer parada técnica. Conectada por carril bici con el centro.",
        "address": "Portal de Foronda, 46",
        "city": "Vitoria-Gasteiz",
        "latitude": 42.864700,
        "longitude": -2.685300,
        "rating": 4.8,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Parking Faro de Finisterre",
        "category": "parking",
        "description": "Parking en el fin del mundo. Vistas espectaculares al océano y atardeceres increíbles. Muy expuesto al viento. Solo aparcar y dormir, prohibido sacar toldos.",
        "address": "Carretera del Faro",
        "city": "Fisterra (A Coruña)",
        "latitude": 42.882400,
        "longitude": -9.271800,
        "rating": 4.9,
        "is_sleepable": True,
        "has_water": False,
        "has_waste_dump": False
    },
    {
        "name": "Área de Servicio Ugaldebieta",
        "category": "water_waste",
        "description": "Punto estratégico de vaciado y llenado en la autovía A-8. Servicios gratuitos si echas combustible. Perfecto para hacer ruta por el norte.",
        "address": "Autovía A-8, Km 131",
        "city": "Abanto Zierbena (Bizkaia)",
        "latitude": 43.321400,
        "longitude": -3.072800,
        "rating": 4.0,
        "is_sleepable": False,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Camper Park Costa Blanca",
        "category": "campground",
        "description": "Área privada de pago (Camper Park). Instalaciones de primera calidad, electricidad, duchas calientes y lavandería. Ideal para estancias largas en invierno.",
        "address": "Camí del Romeral",
        "city": "L'Alfàs del Pi (Alicante)",
        "latitude": 38.583300,
        "longitude": -0.091100,
        "rating": 4.7,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Parking Playa de Valdevaqueros",
        "category": "parking",
        "description": "Explanada de tierra frente a la playa. Mítico para furgonetas y amantes del kitesurf. En verano suele ser de pago por el día. Cero servicios.",
        "address": "N-340, Km 75.5",
        "city": "Tarifa (Cádiz)",
        "latitude": 36.071850,
        "longitude": -5.663180,
        "rating": 4.5,
        "is_sleepable": True,
        "has_water": False,
        "has_waste_dump": False
    },
    {
        "name": "Área Municipal de Astorga",
        "category": "campground",
        "description": "Área pública junto a la plaza de toros. Muy tranquila, a 10 minutos andando de la Catedral y el Palacio de Gaudí. Parada clásica de la Ruta de la Plata.",
        "address": "Calle de los Derechos Humanos",
        "city": "Astorga (León)",
        "latitude": 42.455200,
        "longitude": -6.065500,
        "rating": 4.6,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Punto de Vaciado La Jonquera",
        "category": "water_waste",
        "description": "Último/primer punto de vaciado seguro antes de cruzar la frontera con Francia. Muy concurrido.",
        "address": "N-II, Polígono Industrial",
        "city": "La Jonquera (Girona)",
        "latitude": 42.404200,
        "longitude": 2.877600,
        "rating": 3.8,
        "is_sleepable": False, 
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Área Camper Peñíscola Los Pinos",
        "category": "campground",
        "description": "Camper park privado a 15 min de la playa. Suelo de gravilla, muy llano. Permiten sacar mesas y sillas (comportamiento de camping).",
        "address": "Camí de la Volta",
        "city": "Peñíscola (Castellón)",
        "latitude": 40.383500,
        "longitude": 0.395100,
        "rating": 4.4,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Área de Autocaravanas de Cáceres (Valhondo)",
        "category": "campground",
        "description": "Área municipal gratuita muy famosa. A 15 minutos andando del casco histórico. Suele llenarse rápido en puentes. Servicios de agua y vaciado gratuitos.",
        "address": "Avenida del Brocense",
        "city": "Cáceres",
        "latitude": 39.481600,
        "longitude": -6.368600,
        "rating": 4.5,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Área del Parque de Cabárceno",
        "category": "campground",
        "description": "Un lugar espectacular junto a un lago en el exterior del parque de animales. Entorno natural increíble. Muy tranquilo por la noche.",
        "address": "Lago de Acebo",
        "city": "Obregón (Cantabria)",
        "latitude": 43.350300,
        "longitude": -3.854400,
        "rating": 4.8,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Parking Los Peñones (Sierra Nevada)",
        "category": "parking",
        "description": "El parking para autocaravanas más alto de España (2.500m). De pago en temporada de esquí (unos 15€). Perfecto para salir esquiando desde la furgo. Frío extremo en invierno.",
        "address": "Carretera de la Sierra",
        "city": "Monachil (Granada)",
        "latitude": 37.098400,
        "longitude": -3.390800,
        "rating": 4.6,
        "is_sleepable": True,
        "has_water": False,
        "has_waste_dump": True
    },
    {
        "name": "Área Camper Pinto (Madrid)",
        "category": "campground",
        "description": "Punto estratégico para visitar Madrid capital. Muy cerca de la estación de tren de cercanías. Zona asfaltada, videovigilada y con todos los servicios. De pago.",
        "address": "Calle Pablo Picasso",
        "city": "Pinto (Madrid)",
        "latitude": 40.244700,
        "longitude": -3.695300,
        "rating": 4.3,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Estación de Vaciado CEPSA - Meco",
        "category": "water_waste",
        "description": "Gasolinera en el corredor del Henares con borne específico Euro-Relais. Muy útil para los que entran o salen de Madrid por la A-2.",
        "address": "Autovía A-2, Km 35",
        "city": "Meco (Madrid)",
        "latitude": 40.521500,
        "longitude": -3.328300,
        "rating": 4.0,
        "is_sleepable": False,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Parking Dinópolis",
        "category": "parking",
        "description": "Parking gigantesco y gratuito frente al parque temático. El ayuntamiento y el parque permiten la pernocta sin problema. Muchísimo espacio y muy seguro.",
        "address": "Polígono Los Planos",
        "city": "Teruel",
        "latitude": 40.329400,
        "longitude": -1.085800,
        "rating": 4.2,
        "is_sleepable": True,
        "has_water": False,
        "has_waste_dump": False
    },
    {
        "name": "Área Camper Riumar (Delta de l'Ebre)",
        "category": "campground",
        "description": "Área privada muy bien cuidada en el corazón del Delta. Ideal para rutas en bici y avistamiento de aves. Suelo de tierra compactada.",
        "address": "Passeig Marítim",
        "city": "Deltebre (Tarragona)",
        "latitude": 40.727800,
        "longitude": 0.835300,
        "rating": 4.6,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Parking de la Selva de Irati",
        "category": "parking",
        "description": "Aparcamiento en plena naturaleza para visitar el bosque (acceso por Orbaizeta). Hay que pagar una pequeña tasa de conservación ambiental en temporada alta. Cero contaminación lumínica.",
        "address": "Carretera a Irati",
        "city": "Orbaizeta (Navarra)",
        "latitude": 43.003300,
        "longitude": -1.229400,
        "rating": 4.7,
        "is_sleepable": True,
        "has_water": False,
        "has_waste_dump": False
    },
    {
        "name": "Área Municipal de Muxía",
        "category": "campground",
        "description": "Frente al mar y muy cerca del santuario. Suele hacer bastante viento pero las vistas son inmejorables. Servicios básicos gratuitos.",
        "address": "Rúa Virxe da Barca",
        "city": "Muxía (A Coruña)",
        "latitude": 43.107500,
        "longitude": -9.215500,
        "rating": 4.4,
        "is_sleepable": True,
        "has_water": True,
        "has_waste_dump": True
    },
    {
        "name": "Gasolinera Repsol - Área de Servicio del Desierto",
        "category": "water_waste",
        "description": "En plena ruta por el desierto de Tabernas. Tienen una plataforma de vaciado muy amplia para autocaravanas grandes.",
        "address": "N-340a, Km 464",
        "city": "Tabernas (Almería)",
        "latitude": 37.050600,
        "longitude": -2.392500,
        "rating": 3.9,
        "is_sleepable": False,
        "has_water": True,
        "has_waste_dump": True
    }
]

def seed_database():
    with app.app_context():
        # 1. Crear un usuario "Admin" para asociar estos lugares
        admin = User.query.filter_by(email="camperbot@app.com").first()
        if not admin:
            admin = User(
                email="camperbot@app.com",
                password_hash="password_segura",
                name="CamperBot Oficial"
            )
            db.session.add(admin)
            db.session.commit()
            print("👤 Usuario CamperBot creado.")

        # 2. Insertar los lugares evitando duplicados
        spots_added = 0
        for spot_data in CAMPER_SPOTS:
            exists = Post_spot.query.filter_by(name=spot_data["name"]).first()
            if not exists:
                new_spot = Post_spot(user_id=admin.id, **spot_data)
                db.session.add(new_spot)
                spots_added += 1

        db.session.commit()
        print(f"🚐 ¡Éxito! Se han insertado {spots_added} nuevos spots camper en tu base de datos local.")



if __name__ == '__main__':
    seed_database()