import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer()
	const [isLogin, setIsLogin] = useState(false)
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: "auth_logout" });
		navigate("/");
	};


	useEffect(() => {
		if (store.user?.user_name) {
			setIsLogin(true)
		} else {
			setIsLogin(false)
		}
	}, [store.user])

	return (
		<>
			<nav className="navbar navbar-expand-md w-100 mt-auto bg-dark"
				style={{
					zIndex: 1000

				}}>
				<div className="container-fluid">
					<Link to="/" className="navbar-brand text-white"><i className="fa-solid fa-van-shuttle fa-lg"></i></Link>

					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav mb-2 mb-md-0">
							<li className="nav-item "><Link className="nav-link text-white fw-semibold" to="/vans">Rent</Link></li>
							<li className="nav-item"><Link className="nav-link text-white fw-semibold" to="/map">Mapa</Link></li>
						</ul>
						<div className="d-flex ms-auto">
							{isLogin ? (
								<div className="dropdown">
									<button
										className="btn btn-success px-4 py-2 fw-bold rounded-pill dropdown-toggle d-flex align-items-center gap-2"
										type="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<i className="fa-solid fa-user"></i>
										{store.user?.user_name}
									</button>

									<ul
										className="dropdown-menu dropdown-menu-end mt-2 border-0 p-1"
										style={{
											backgroundColor: "#1a1a1a",
											borderRadius: "12px",
											minWidth: "100%",
											zIndex: 9999,
											border: "0.5px solid rgba(255,255,255,0.1) !important"
										}}
									>
										<li className="px-3 py-2">
										</li>
										<li>
											<Link
												className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2"
												to="/user"
												style={{ color: "rgba(255,255,255,0.85)" }}
												onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
												onMouseLeave={e => e.currentTarget.style.background = "transparent"}
											>
												<i className="fa-solid fa-id-card text-success" style={{ width: "16px" }}></i>
												Mi perfil
											</Link>
										</li>

										{/* Divider */}
										<li>
											<hr className="dropdown-divider" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
										</li>

										{/* Cerrar sesión */}
										<li>
											<button
												className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2"
												onClick={handleLogout}
												style={{ color: "#f08080" }}
												onMouseEnter={e => e.currentTarget.style.background = "rgba(240,128,128,0.08)"}
												onMouseLeave={e => e.currentTarget.style.background = "transparent"}
											>
												<i className="fa-solid fa-right-from-bracket" style={{ width: "16px" }}></i>
												Cerrar sesión
											</button>
										</li>
									</ul>
								</div>
							) : (
								<div className="d-flex gap-2">
									<Link to="/signup">
										<button className="btn btn-success px-5 py-2 fw-bold rounded-pill">Registrate</button>
									</Link>
									<Link to="/login">
										<button className="btn btn-success px-5 py-2 fw-bold rounded-pill">Ingresar</button>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};