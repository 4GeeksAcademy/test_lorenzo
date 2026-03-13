import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { WelcomeModal } from "../components/Welcomemodal.jsx";
import { login } from "../services/loginServices.js";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showWelcomeModal, setShowWelcomeModal] = useState(false)
	const [user, setUser] = useState({
		email: "",
		password: "",
	})

	
	const handleChange = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value
		})
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!user.email.trim() || !user.password.trim()) {
			setError("Por favor, completa todos los campos.");
			return;
		}

		setLoading(true);

		const response = await login(user)
		if (response.error) {
			setError(response.error);
			setLoading(false);
			return;
		}

		localStorage.setItem("token", response.token);
		dispatch({ type: "auth_login", payload: { token: response.token } });

		const hasUserName = response.user?.user_name


		if (!hasUserName) {
			setShowWelcomeModal(true);
			setLoading(false);
			return
		}
		dispatch({ type: "auth_set_user", payload: response.user });
		navigate("/user")
	}

	useEffect(() => {
		console.log(user)
	}, [user])

	return (
		<>
			<div className="bg-white min-vh-100">
				<div className="container my-4">
					{showWelcomeModal &&
						<WelcomeModal show={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
					}
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
										<form onSubmit={handleSubmit}>
											<div className="mb-3">
												<label htmlFor="exampleInputEmail1" className="form-label text-white">Correo electronico</label>
												<div className="input-group">
													<span className="input-group-text">
														<i className="fa-solid fa-envelope"></i>
													</span>
													<input type="email" className="form-control"
														id="exampleInputEmail1"
														aria-describedby="emailHelp"
														name="email"
														value={user.email}
														onChange={handleChange}
														required>
													</input>
													<small id="emailHelp" className="form-text text-white text-center fst-italic">
														Nunca compartiremos tu correo electrónico con nadie más.
													</small>
												</div>
											</div>
											<div className="mb-3">
												<label htmlFor="exampleInputPassword1" className="form-label text-white">Contraseña</label>
												<div className="input-group">
													<span className="input-group-text">
														<i className="fa-solid fa-lock" />
													</span>
													<input type={showPassword ? "text" : "password"}
														className="form-control"
														placeholder="••••••••"
														id="exampleInputPassword1"
														name="password"
														value={user.password}
														onChange={handleChange}
														required>
													</input>
													<button
														type="button"
														className="btn border text-secondary bg-white border"
														onClick={() => setShowPassword((s) => !s)}>
														<i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
													</button>
												</div>
											</div>
											<button
												type="submit"
												className="btn btn-primary w-100"
												disabled={loading}
											>
												{loading ? (
													<span className="d-inline-flex align-items-center gap-2">
														<span
															className="spinner-border spinner-border-sm"
															role="status"
															aria-hidden="true"
														></span>
														Ingresando..
													</span>
												) : (
													"Ingresar a tu cuenta"
												)}
											</button>
										</form>
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