import { Link } from "react-router-dom";

export const AboutUs = () => {

    const Valores = [
        { title: "Libertad", icon: "fa-sun", text: "Viaja sin horarios ni fronteras." },
        { title: "Naturaleza", icon: "fa-tree", text: "Respetamos y cuidamos cada lugar que visitamos." },
        { title: "Comunidad", icon: "fa-handshake", text: "Una red global de entusiastas del mundo camper." }
    ];

    const Equipo = [
        { name: "Joset", img: "fa-regular fa-user fa-2xl", text: "Parte del nuestro equipo" },
        { name: "Santiago", img: "fa-regular fa-user fa-2xl", text: "Parte del nuestro equipo" },
        { name: "Lorenzo", img: "fa-regular fa-user fa-2xl", text: "Parte del nuestro equipo" }
    ]

    return (
        <>
            <h2 className="fw-bold text-center display-4">Nacidos para viajar</h2>
            <div className="row">
                <div className="col-12 col-md-4 py-5">
                    <p className="fs-4" style={{ textAlign: "justify" }}>
                        <strong>Vandoo</strong> nació de la pasión por la libertad. Somos una comunidad que cree que la mejor forma de conocer el mundo es sobre ruedas. Conectamos viajeros con los mejores rincones y servicios para que tu única preocupación sea disfrutar del paisaje.
                    </p>
                </div>
                <div className="col-12 col-md-8 text-center py-5">
                    <img src="https://i.imgur.com/sP7Wt0G.jpeg" className="img-fluid rounded shadow-sm" alt="" />
                </div>
            </div>

            <hr className="my-5" />
            <h2 className="display-6">Nuestros valores</h2>
            <div className="row mt-5">
                {Valores.map((item, index) => (
                    <div className="col-12 col-md-4" key={index}>
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

            <hr className="my-5" />
            <h2 className="display-6">Equipo</h2>
            <div className="row mt-5">
                {Equipo.map((item, index) => (
                    <div className="col-12 col-md-4" key={index}>
                        <div className="card h-100 border-0 shadow">
                            <div className="card-body text-center">
                                <div className="fs-1 mb-3 text-success">
                                    <i className={`fa-solid ${item.img}`}></i>
                                </div>
                                <h5 className="card-title fw-bold">{item.name}</h5>
                                <p className="card-text text-muted">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <hr className="my-5" />
            <h2 className="display-6">¿Listo para unirte?</h2>
            <p className="fs-4">Forma parte de esta comunidad compartiendo y descubriendo esos lugares desconocidos</p>
            <div className="d-flex gap-3">
                <Link to={"/signup"}>
                    <button className="btn btn-success px-5 py-2 fw-bold rounded-pill">¡Registrate ya!</button>
                </Link>
                <Link to={"/map"}>
                    <button className="btn btn-success px-5 py-2 fw-bold rounded-pill">¡Explora el mapa!</button>
                </Link>
            </div>
        </>
    )
};