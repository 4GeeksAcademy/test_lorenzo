export const Blog = () => (
    <>
        <div className="col-12 py-5">
            <h2 className="fw-bold display-6 text-center mb-4">Guía Básica de Uso</h2>
            <div className="row g-3">
                {[
                    { title: "Lugares", text: "Explora el mapa para encontrar esos lugares escondidos.", icon:"fa-solid fa-map"},
                    { title: "Crear", text: "Crear waypoints de lugares para que los Vandooers los visiten.", icon:"fa-solid fa-location-dot" },
                    { title: "Comunidad", text: "Comente, agrega foto y comprate tus experiencias.", icon:"fa-solid fa-handshake" },
                    { title: "Guarda", text: "Guarda esos tus lugares favoritos para repetir.", icon:"fa-solid  fa-heart-circle-plus" },
                    { title: "Alquila", text: "¿Necesitas una camper? Te ofrecemos un gran catálogo para que no pares de viajar.", icon:"fa-solid fa-van-shuttle" }
                ].map((item, index) => (
                    <div className="col-md-6" key={index}>
                        <div className="card h-100 border-0 shadow bg-light">
                            <div className="card-body text-center">
                                <i className={`fs-1 mb-3 text-success ${item.icon} `}></i>
                                <h5 className="mt-2">{item.title}</h5>
                                <p className="small mb-0">{item.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
);