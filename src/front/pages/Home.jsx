import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {

	const [activeTab, setActiveTab] = useState("explora");

	useEffect(() => {

	}, [])

	return (
		<div className="bg-white min-vh-100">
			<div className="container my-4">
				<div className="row mb-5 g-4">
					<div className="col-lg-12">
						<div className="d-flex flex-column justify-content-between align-items-center rounded shadow-lg overflow-hidden"
							style={{
								minHeight: "550px",
								backgroundImage: 'url("https://i.imgur.com/l3Bb92y.jpeg")',
								backgroundSize: 'cover',
								backgroundPosition: 'center'
							}}>
							<div className="text-center mt-auto">
								<h1 className="text-white m-0"
									style={{
										fontSize: 'clamp(3.5rem, 12vw, 10rem)',
										fontFamily: "Montserrat",
										textShadow: '4px 4px 15px rgba(0, 0, 0, 0.8)',
										letterSpacing: '-2px'
									}}>Vandoo</h1>
								<p className="text-white fs-2 fst-italic fw-light"
									style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
									Menos hoteles, más estrellas
								</p>
							</div>

							{/* TABS */}
							<div className="bg-black w-100 mt-auto bg-opacity-25" style={{ backdropFilter: "blur(5px)" }}>
								<ul className="nav justify-content-center p-2">
									<li className="nav-item">
										<button
											className={`nav-link text-white fw-bold ${activeTab === "explora" ? "border-bottom border-3" : ""}`}
											onClick={() => setActiveTab("explora")}>Explora</button>
									</li>
									<li className="nav-item">
										<button
											className={`nav-link text-white fw-bold ${activeTab === "nosotros" ? "border-bottom border-3" : ""}`}
											onClick={() => setActiveTab("nosotros")}>¿Quiénes somos?</button>
									</li>
									<li className="nav-item">
										<button
											className={`nav-link text-white fw-bold ${activeTab === "blog" ? "border-bottom border-3" : ""}`}
											onClick={() => setActiveTab("blog")}>Blog / Guía</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div className="row py-5 animate__animated animate__fadeIn">
					{activeTab === "explora" && (
						<>
							<div className="col-md-6">
								<img src="https://i.imgur.com/JithdB4.png" className="img-fluid" alt="Explora" />
							</div>
							<div className="col-md-6 d-flex flex-column justify-content-center">
								<h2 className="fw-bold display-6">Tu aventura comienza aquí</h2>
								<p className="lead text-muted">
									Encuentra desde <strong>rutas de senderismo</strong> espectaculares hasta
									<strong> gasolineras</strong> cercanas y <strong>campings</strong> con encanto.
								</p>
								<Link to="/map" className="btn btn-success px-5 py-2 fw-bold rounded-pill">
									Abrir el Mapa
								</Link>
							</div>

							<hr className="my-5" />
								<div className="col-md-6 d-flex flex-column justify-content-center">
									<h2 className="fw-bold display-6">¿Necesitas una camper?</h2>
									<p className="lead text-muted">Tenemos un gran catálogo a tu disposición para que empieces hoy mismo.</p>
									<Link to="/vans" className="btn btn-success px-5 py-2 fw-bold rounded-pill">Ver Catálogo</Link>
								</div>
								<div className="col-md-6">
									<img src="https://i.imgur.com/67hiCGq.png" className="img-fluid" alt="Camper catalog" />
								</div>
						</>
					)}

					{activeTab === "nosotros" && (
						<div className="col-12 text-center py-4">
							<h2 className="fw-bold display-6">Nacidos para viajar</h2>
							<p className="lead mx-auto" style={{ maxWidth: "800px" }}>
								<strong>Vandoo</strong> nació de la pasión por la libertad. Somos una comunidad que cree que la mejor forma de conocer el mundo es sobre ruedas. Conectamos viajeros con los mejores rincones y servicios para que tu única preocupación sea disfrutar del paisaje.
							</p>
						</div>
					)}

					{activeTab === "blog" && (
						<div className="col-12">
							<h2 className="fw-bold display-6 text-center mb-4">Guía Básica de Uso Camper</h2>
							<div className="row g-3">
								<div className="col-md-4">
									<div className="card h-100 border-0 shadow-sm bg-light">
										<div className="card-body">
											<h5>💧 Gestión de Aguas</h5>
											<p className="small">Aprende a diferenciar entre aguas limpias, grises y negras, y dónde vaciarlas correctamente.</p>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="card h-100 border-0 shadow-sm bg-light">
										<div className="card-body">
											<h5>🔋 Energía y Baterías</h5>
											<p className="small">Consejos para no quedarte sin luz: uso de placas solares y control de consumo.</p>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="card h-100 border-0 shadow-sm bg-light">
										<div className="card-body">
											<h5>🌲 Pernoctar vs Acampar</h5>
											<p className="small">Conoce la normativa para evitar multas y respetar el entorno natural.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};