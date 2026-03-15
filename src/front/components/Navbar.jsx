import { Link } from "react-router-dom";
import { OffcanvasUser } from "./OffcanvasUser";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer()
	const [isLogin, setIsLogin] = useState(false)

	const btnTexte = isLogin
		? store.user?.user_name
		: "Signup"

	const btnTO = isLogin
		? "#"
		: "/signup"

	useEffect(() => {
		if (store.user?.user_name) {
			setIsLogin(true)
		} else {
			setIsLogin(false)
		}
	}, [store.user])

	return (
		<>
				<nav className="navbar navbar-expand-md">
					<div className="container-fluid">
						<Link to="/" className="navbar-brand"><i className="fa-solid fa-van-shuttle fa-lg"></i></Link>

						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
							<span className="navbar-toggler-icon"></span>
						</button>

						<div className="collapse navbar-collapse" id="navbarSupportedContent">
							<ul className="navbar-nav mb-2 mb-md-0">
								<li className="nav-item"><Link className="nav-link" to="/vans">Rent</Link></li>
								<li className="nav-item"><Link className="nav-link" to="/map">Mapa</Link></li>
							</ul>
							<div className="d-flex ms-auto">
								{isLogin ? (
									<button
										className="btn btn-success px-5 py-2 fw-bold rounded-pill"
										type="button"
										data-bs-toggle="offcanvas"
										data-bs-target="#offcanvasUser"
									>
										{btnTexte}
									</button>
								) : (
									<div className="d-flex gap-2">
										<Link to={btnTO}>
											<button className="btn btn-success px-5 py-2 fw-bold rounded-pill">{btnTexte}</button>
										</Link>
										<Link to={"/login"}>
											<button className="btn btn-success px-5 py-2 fw-bold rounded-pill">Login</button>
										</Link>
									</div>

								)}
							</div>
						</div>
					</div>
				</nav>
			<OffcanvasUser id="offcanvasUser" />
		</>
	);
};