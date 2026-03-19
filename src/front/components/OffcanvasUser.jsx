import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import { getUserFavorites } from "../services/spotServices";

export const OffcanvasUser = ({ id }) => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const loadFavorites = async () => {
            if (localStorage.getItem("token")) {
                const favs = await getUserFavorites();
                dispatch({
                    type: "set_fav_spots",
                    payload: favs
                });
            }
        };
        
        loadFavorites();
    }, [store.user]);

    const handleLogout = () => {
        dispatch({ type: "auth_logout" });
        navigate("/");
    };

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id={id} aria-labelledby="offcanvasLabel">
            <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title" id="offcanvasLabel">
                    <i className="fa-solid fa-user-circle me-2"></i>
                    Mi Perfil
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">
                <div className="d-flex flex-column h-100">
                    <div className="text-center mb-4">
                        <div className="bg-light rounded-circle d-inline-block p-3 mb-2">
                            <i className="fa-solid fa-user fa-3x text-secondary"></i>
                        </div>
                        <h6 className="mb-0">{store.user?.user_name}</h6>
                        <small className="text-muted">{store.user?.email}</small>
                    </div>

                    <ul className="list-group list-group-flush mb-4">
                        <li className="list-group-item border-0 px-0">
                            <i className="fa-solid fa-heart me-2 text-success"></i>
                            Favoritos ({store.fav_spots ? store.fav_spots.length : 0})
                        </li>
                        <li className="list-group-item border-0 px-0">
                            <i className="fa-solid fa-calendar-check me-2 text-primary"></i>
                            Mis Reservas
                        </li>
                    </ul>

                    <div className="mt-auto">
                        <button
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={handleLogout}
                            data-bs-dismiss="offcanvas"
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};