import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { veryfytoken } from "../services/loginServices"
import { WelcomeModal } from "../components/Welcomemodal.jsx";


export const Layout = () => {
    const {store, dispatch} =useGlobalReducer()
    const[isLoading, setIsLoading]= useState(true)
    const [showWelcome, setShowWelcome] = useState(false)

    useEffect (()=> {
        const initialize =async()=> {

            const timer = new Promise((resolve) => setTimeout(resolve, 2000));
            const verify = veryfytoken(dispatch);
            await Promise.all([timer, verify]);
            setIsLoading(false)
        }
        initialize();
    },[dispatch])

 useEffect(() => {
    if (isLoading) return; // 👈 espera a que termine el loading
    if (store.user && !store.user.user_name) {
        setShowWelcome(true);
    } else {
        setShowWelcome(false);
    }
}, [store.user, isLoading])

    if (isLoading) {
        return (
            <div 
                className="d-flex flex-column justify-content-center align-items-center" 
                style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
            >
                <div className="text-success mb-3">
                    <i className="fa-solid fa-van-shuttle fa-4x fa-bounce"></i>
                </div>
                <h4 className="fw-light text-secondary">Preparando la ruta...</h4>
                <div className="mt-2 text-muted small italic">Verificando tu equipaje...</div>
            </div>
        );
    }
    return (
        <ScrollToTop>
            <Navbar />
                <Outlet />
                <WelcomeModal
                show={showWelcome}
                onClose={() => setShowWelcome(false)}
            />
            <Footer />
        </ScrollToTop>
    )
}