import { useEffect, useState } from "react";
import { Explore } from "../components/Landing-components/Explore";
import { AboutUs } from "../components/Landing-components/AboutUs";
import { Blog } from "../components/Landing-components/Blog";

export const Home = () => {

	const [activeTab, setActiveTab] = useState("explora");

	useEffect(() => {

	}, [])

	return (
		<>
			<div className="hero-container min-vh-100 d-flex flex-column"
				style={{
					backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://i.imgur.com/l3Bb92y.jpeg")',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundAttachment: 'fixed'
				}}>

				<div className="container my-auto text-center">
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
				<div className="w-100 mt-auto bg-black bg-opacity-25" style={{ backdropFilter: "blur(5px)" }}>
					<ul className="nav justify-content-center p-2">
						<li className="nav-item">
							<button
								className={`nav-link text-white fw-semibold ${activeTab === "explora" ? "border-bottom border-3" : ""}`}
								onClick={() => setActiveTab("explora")}>Explora</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link text-white fw-semibold ${activeTab === "nosotros" ? "border-bottom border-3" : ""}`}
								onClick={() => setActiveTab("nosotros")}>¿Quiénes somos?</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link text-white fw-semibold ${activeTab === "blog" ? "border-bottom border-3" : ""}`}
								onClick={() => setActiveTab("blog")}>Blog / Guía</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="container mt-2"> 
                <div className="row">
                    
                    {activeTab === "explora" && <Explore />}
                    {activeTab === "nosotros" && <AboutUs />}
                    {activeTab === "blog" && <Blog />}
                </div>
            </div>
		</>

	);
};