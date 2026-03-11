import { Link } from "react-router-dom";
// import { OffcanvasUser } from "./OffcanvasUser";

export const Navbar = () => {

	return (
		<>
			<nav className="navbar navbar-expand-md bg-body-tertiary">
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
						<div className="d-flex ms-auto gap-2">
							<Link to="/signup">
								<button className="btn btn-primary" type="submit">Signup</button>
							</Link>
							<div>
								<button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser" aria-controls="offcanvasRight">USER</button>
							</div>
						</div>
					</div>
				</div>
			</nav>
			{/* <OffcanvasUser id="offcanvasUser" /> */}
		</>
	);
};