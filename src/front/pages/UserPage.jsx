import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { WelcomeModal } from "../components/Welcomemodal";
import { getUserBookings } from "../services/bookingServices"



export const UserPage = () => {

    const { store, dispatch } = useGlobalReducer();
    const [showEditModal, setShowEditModal] = useState(false)
    const favSpots = store.user?.fav_spots || [];
    const reservas = store.booking || [];

    useEffect(() => {
        if (!store.user?.id) return
        getUserBookings(store.user.id, dispatch) 
    }, [store.user?.id])



    return (
        <div className="container conteiner-fluid m-0 p-0 hero-container min-vh-100 d-flex flex-column"
            style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://i.imgur.com/l3Bb92y.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                maxWidth: '100%',
                width: '100vw'
            }}>

            <div className="card border-0 shadow-sm mt-4 overflow-hidden w-75" style={{ borderRadius: "15px" }}>
                <div className="card-body p-4 p-md-5 bg-white">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            {/* Avatar con inicial o imagen */}
                            <div className="bg-success text-white d-flex align-items-center justify-content-center rounded-circle shadow text-uppercase"
                                style={{ width: "150px", height: "150px", fontSize: "3.5rem" }}>
                                {store.user?.name?.[0] || <i className="fa-solid fa-user"></i>}
                            </div>
                        </div>
                        <div className="col mt-3 mt-md-0">
                            <div>
                                <h2 className="mb-1 fw-bold">{store.user?.user_name || "usuario_camper"}</h2>
                            </div>
                            <p className="text-muted mb-0">
                                <i className="fa-solid fa-at me-2 text-success"></i>
                                {store.user?.name || "Viajero@"} {store.user?.last_name || ""}
                            </p>
                            <p className="text-muted">
                                <i className="fa-solid fa-envelope me-2 text-success"></i>
                                {store.user?.email}
                            </p>
                            <p className="text-muted">
                                <i className="fa-solid fa-phone me-2 text-success"></i>
                                {store.user?.phone}
                            </p>
                            <p className="text-muted">
                                <i className="fa-solid fa-house me-2 text-success"></i>
                                {store.user?.address}
                            </p>
                        </div>
                        <div className="col-12 col-md-auto mt-3 mt-md-0">
                            <button className="btn btn-outline-success rounded-pill px-4"
                                onClick={() => setShowEditModal(true)}>
                                <i className="fa-solid fa-pen-to-square me-2"></i>Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>





            <div className="container-fluid py-4">
                <div className="row justify-content-center ">
                    <div className="col-12 col-xl-9">
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <h3 className="fw-bold bg-white text-center p-1" style={{ borderRadius: "15px" }}>
                                    <i className="fa-solid fa-calendar-check me-2 text-success"></i>
                                    Mis Reservas
                                </h3>

                                <div className="d-flex flex-column gap-3">
                                    {reservas.length > 0 ? reservas.map(res => (
                                        <div className="card shadow-sm border-0 overflow-hidden" key={res.booking_id}>
                                            <div className="row g-0 align-items-center">
                                                <div className="col-4">
                                                    <img
                                                        src={res.van_img || "https://via.placeholder.com/150"}
                                                        className="img-fluid h-100"
                                                        alt="Van"
                                                        style={{ objectFit: "cover", minHeight: "120px" }}
                                                    />
                                                </div>
                                                <div className="col-8 p-3">
                                                    <h6 className="card-title fw-bold mb-1">{res.van_name}</h6>
                                                    <p className="small text-muted mb-1">
                                                        <i className="fa-solid fa-calendar-days me-1 text-success"></i>
                                                        {res.start_date} → {res.end_date}
                                                    </p>
                                                    <p className="small text-muted mb-2">
                                                        <i className="fa-solid fa-euro-sign me-1 text-success"></i>
                                                        {res.total_price}€
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className={`badge rounded-pill border ${res.status === "confirmed" ? "bg-success-subtle text-success border-success-subtle" :
                                                                res.status === "cancelled" ? "bg-danger-subtle text-danger border-danger-subtle" :
                                                                    "bg-warning-subtle text-warning border-warning-subtle"
                                                            }`}>
                                                            {res.status}
                                                        </span>
                                                        <button className="btn btn-sm btn-outline-primary rounded-pill">Detalles</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-5 border rounded bg-light text-muted">
                                            Aún no tienes reservas.
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="col-12 col-md-6">
                                <h3 className="fw-bold mb-4 bg-white text-center aling-items-center p-1" style={{ borderRadius: "15px" }}>
                                    <i className="fa-solid fa-heart me-2 text-danger"></i>
                                    Favoritos
                                </h3>
                                <div className="d-flex flex-column gap-3">
                                    {favSpots.length > 0 ? favSpots.map(spot => (
                                        <div className="card shadow-sm border-0 overflow-hidden" key={spot.spot_id}>
                                            <div className="row g-0 align-items-center">
                                                <div className="col-4">
                                                    <img
                                                        src={spot.media?.[0]?.url || "https://via.placeholder.com/150"}
                                                        className="img-fluid h-100"
                                                        alt={spot.name}
                                                        style={{ objectFit: "cover", minHeight: "120px" }}
                                                    />
                                                </div>
                                                <div className="col-8 p-3">
                                                    <h6 className="card-title fw-bold mb-1">{spot.name}</h6>
                                                    <p className="small text-muted mb-2">
                                                        <i className="fa-solid fa-location-dot me-1 text-danger"></i>
                                                        {spot.city || spot.address}
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">
                                                            ⭐ {spot.rating || "Sin rating"}
                                                        </span>
                                                        <button className="btn btn-sm btn-outline-danger rounded-pill">Ver</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col text-center py-5 border rounded bg-light text-muted">
                                            <i className="fa-solid fa-heart-crack fa-2x mb-3 d-block opacity-25"></i>
                                            No tienes favoritos guardados todavía.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <WelcomeModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </div>
    );
};