import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<>
			<nav className="navbar navbar-expand-md bg-body-tertiary">
				<div className="container-fluid">
					<a className="navbar-brand" href="#"><i className="fa-solid fa-van-shuttle fa-lg"></i></a>

					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav mb-2 mb-md-0">
							<li className="nav-item"><Link className="nav-link" to="/vans">Rent</Link></li>
							<li className="nav-item"><Link className="nav-link" to="/map">Mapa</Link></li>
						</ul>
						<form className="d-flex mx-auto" role="search">
							<input className="form-control me-2" type="search" placeholder="Search" />
							<button className="btn btn-outline-success" type="submit">Search</button>
						</form>
						<button className="btn btn-primary" type="submit">Signup</button>
					</div>
				</div>
			</nav>
		</>
	);
};