import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
	return (
		<footer className="bg-dark text-white pt-5 pb-4 mt-5">
			<div className="container text-center text-md-start">
				<div className="row text-center text-md-start">

					<div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
						<h5 className="text-uppercase mb-4 fw-bold text-success">Vandoo</h5>
						<p className="small text-secondary">
							Redefiniendo los viajes en carretera. Menos hoteles, más estrellas bajo el cielo. Tu comunidad camper de confianza.
						</p>
					</div>

					<div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
						<h5 className="text-uppercase mb-4 fw-bold small">Servicios</h5>
						<p><Link to="/map" className="text-white text-decoration-none small">Mapa de Rutas</Link></p>
						<p><Link to="/vans" className="text-white text-decoration-none small">Alquiler de Vans</Link></p>
						<p><Link to="/blog" className="text-white text-decoration-none small">Guía Camper</Link></p>
					</div>

					<div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
						<h5 className="text-uppercase mb-4 fw-bold small">Ayuda</h5>
						{/* <p><Link to="/faq" className="text-white text-decoration-none small">Preguntas Frecuentes</Link></p>
						<p><Link to="/terms" className="text-white text-decoration-none small">Términos de Uso</Link></p>
						<p><Link to="/contact" className="text-white text-decoration-none small">Contacto</Link></p> */}
					</div>

					<div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
						<h5 className="text-uppercase mb-4 fw-bold small">Síguenos</h5>
						<div className="d-flex justify-content-center justify-content-md-start gap-3">
							<i className="fab fa-instagram fs-4"></i>
							<i className="fab fa-facebook fs-4"></i>
							<i className="fab fa-twitter fs-4"></i>
						</div>
						<p className="mt-3 small text-secondary">
							<i className="fas fa-envelope me-2"></i> info@vandoo.com
						</p>
					</div>
				</div>

				<hr className="mb-4 mt-5" />

				<div className="row align-items-center">
					<div className="col-md-7 col-lg-8">
						<p className="small text-secondary">
							© {new Date().getFullYear()} Copyright:
							<strong className="text-success"> Vandoo.com</strong>
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}