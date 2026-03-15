import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { veryfytoken } from "../services/loginServices"
import { WelcomeModal } from "../components/Welcomemodal.jsx";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const {store, dispatch} =useGlobalReducer()
    useEffect (()=> {
        veryfytoken(dispatch)
    },[])

    const showModal = !!(store.user && !store.user.user_name);
    return (
        <ScrollToTop>
            <Navbar />
                <Outlet />
                {showModal && (
                <WelcomeModal 
                    show={showModal} 
                    onClose={() => console.log("Modal de bienvenida gestionado")} 
                />
            )}
            <Footer />
        </ScrollToTop>
    )
}