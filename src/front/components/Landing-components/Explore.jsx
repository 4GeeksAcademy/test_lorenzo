import React from "react";
import { Link } from "react-router-dom";

export const Explore = () => {

    const Card = [
        {
            title: "Explora",
            icon: "fa-location-dot",
            text: "Descubre los mejores rincones para pernoctar, desde parkings seguros hasta campings escondidos en plena naturaleza."
        },
        {
            title: "Comparte",
            icon: "fa-map-location-dot",
            text: "Sube tus propias rutas, fotos y consejos. Ayuda a la comunidad a encontrar ese lugar especial que tú ya conoces."
        },
        {
            title: "Guarda",
            icon: "fa-heart-circle-plus",
            text: "Crea tu lista de favoritos. Planifica tu próximo viaje guardando los puntos de interés y gasolineras más convenientes."
        },
        {
            title: "Alquila",
            icon: "fa-van-shuttle",
            text: "¿Aún no tienes furgo? Accede a nuestro catálogo y elige la camper que mejor se adapte a tu estilo de aventura."
        }
    ]
    return (
        <>
            <div className="container my-5">
                <div className="row g-4">
                    {Card.map((item, index) => (
                        <div className="col-12 col-md-6 col-lg-3" key={index}>
                            <div className="card h-100 border-0 shadow">
                                <div className="card-body text-center">
                                    <div className="fs-1 mb-3 text-success">
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    <h5 className="card-title fw-bold">{item.title}</h5>
                                    <p className="card-text text-muted">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container">
                <hr className="my-5" />
                <div className="row">
                    <div className="col-md-6 mb-4 mb-md-0">
                        <img src="https://i.imgur.com/JithdB4.png" className="img-fluid rounded shadow-sm" alt="Explora" />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center text-center text-md-start">
                        <h2 className="fw-bold display-6">Tu aventura comienza aquí</h2>
                        <p className="lead text-muted">
                            Encuentra desde <strong>rutas de senderismo</strong> espectaculares hasta
                            <strong> gasolineras</strong> cercanas y <strong>campings</strong> con encanto.
                        </p>
                        <div>
                            <Link to="/map" className="btn btn-success px-5 py-2 fw-bold rounded-pill">
                                Abrir el Mapa
                            </Link>
                        </div>
                    </div>
                </div>

                <hr className="my-5" />
                <div className="row pb-5">
                    <div className="col-md-6 d-flex flex-column justify-content-center order-2 order-md-1 text-center text-md-start">
                        <h2 className="fw-bold display-6">¿Necesitas una camper?</h2>
                        <p className="lead text-muted">Tenemos un gran catálogo a tu disposición para que empieces hoy mismo.</p>
                        <div>
                            <Link to="/vans" className="btn btn-success px-5 py-2 fw-bold rounded-pill">Ver Catálogo</Link>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4 mb-md-0 order-1 order-md-2">
                        <img src="https://i.imgur.com/67hiCGq.png" className="img-fluid rounded shadow-sm" alt="Camper catalog" />
                    </div>
                </div>
            </div>
        </>
    );
};