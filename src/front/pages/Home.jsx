import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {

	// const { store, dispatch } = useGlobalReducer()

	// const loadMessage = async () => {
	// 	try {
	// 		const backendUrl = import.meta.env.VITE_BACKEND_URL

	// 		if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

	// 		const response = await fetch(backendUrl + "/api/hello")
	// 		const data = await response.json()

	// 		if (response.ok) dispatch({ type: "set_hello", payload: data.message })

	// 		return data

	// 	} catch (error) {
	// 		if (error.message) throw new Error(
	// 			`Could not fetch the message from the backend.
	// 			Please check if the backend is running and the backend port is public.`
	// 		);
	// 	}

	// }

	// useEffect(() => {
	// 	//loadMessage()
	// }, [])

	// return (
	// 	<div className="text-center mt-5">
	// 		<h1 className="display-4">Hello Rigo!!</h1>
	// 		<p className="lead">
	// 			<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
	// 		</p>
	// 		<div className="alert alert-info">
	// 			{store.message ? (
	// 				<span>{store.message}</span>
	// 			) : (
	// 				<span className="text-danger">
	// 					Loading message from the backend (make sure your python 🐍 backend is running)...
	// 				</span>
	// 			)}
	// 		</div>
	// 	</div>
	// );

	return (
		<>
			<div className="bg-white min-vh-100">
				<div className="container my-4">
					<div className="row mb-5 g-4">
						<div className="col-lg-12">
							<div className="position-relative rounded shadow-sm overflow-hidden"
								style={{
									height: '450px',
									backgroundImage: 'url("https://i.imgur.com/l3Bb92y.jpeg")',
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}}>
								<div className="ms-auto m-3 col-12 col-md-4 col-lg-3">
									<div className="bg-dark bg-opacity-25 mt-5 p-4 rounded shadow-lg">
										<h3 className="text-center text-white mb-4 fw-bold">Login</h3>
										<div className="mb-3">
											<input type="text" className="form-control py-2 border-0 bg-light" placeholder="Usuario" />
										</div>
										<div className="mb-3">
											<input type="password" className="form-control py-2 border-0 bg-light" placeholder="Contraseña" />
										</div>
										<button className="btn btn-dark w-100 rounded-pill fw-bold">Entrar</button>
										<div className="text-center  mt-3">
											<small className="text-white">¿No tienes cuenta? <Link to="/signup" className="text-decoration-none"><span className="text-warning cursor-pointer">Regístrate</span></Link></small>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row mb-5 align-items-center text-center text-md-start">
						<img src="https://i.imgur.com/JithdB4.png" alt=""
							style={{
								width: "450px",
								backgroundSize: 'cover',
								backgroundPosition: 'center'
							}} />
						<div className="col-md-6 mt-4 mt-md-0">
							<h2 className="fw-bold display-6">¿Buscas lugares tranquilos?</h2>
							<p className="lead text-muted">
								Encuentra desde <strong>rutas de senderismo</strong> espectaculares hasta
								<strong> gasolineras</strong> cercanas y <strong>campings</strong> con encanto.
							</p>
							<Link to="/map">
								<div className="btn btn-success px-5 py-2 fw-bold shadow-sm rounded-pill">
									Explora el Mapa
								</div>
							</Link>
						</div>
					</div>

					<div className="row mb-5 align-items-center text-center text-md-start">
						<div className="col-md-6">
							<h2 className="fw-bold display-6">¿Necesitas una camper?</h2>
							<p className="lead text-muted">Tenemos un gran catálogo a tu disposición.</p>
							<Link to="/vans">
								<div className="btn btn-success px-4 py-2 fw-bold shadow-sm rounded-pill">Encuéntrala aquí</div>
							</Link >
						</div>
						<div className="col-md-6">
							<div className="p-4 bg-white">
								<img src="https://i.imgur.com/67hiCGq.png" alt=""
									style={{
										height: '450px',
										backgroundSize: 'cover',
										backgroundPosition: 'center'
									}} />
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}; 