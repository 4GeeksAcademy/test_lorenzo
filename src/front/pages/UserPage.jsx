import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { WelcomeModal } from "../components/Welcomemodal";
import { getUserBookings, cancelBooking } from "../services/bookingServices"
import { Link } from "react-router-dom"
import { loadUserFavorites } from "../services/spotServices"
import "./UserPage.css"


export const UserPage = () => {

    const { store, dispatch } = useGlobalReducer();
    const [showEditModal, setShowEditModal] = useState(false)
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [cancelling, setCancelling] = useState(false)

    const favSpots = store.fav_spots || [];
    const reservas = store.booking || [];

    useEffect(() => {
        if (!store.user?.id) return
        getUserBookings(store.user.id, dispatch)
    }, [store.user?.id])

    useEffect(() => {
        if (!store.token) return;
        loadUserFavorites(dispatch);
    }, [store.token]);


    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;
        const idToCancel = bookingToCancel;
        setBookingToCancel(null);
        setCancelling(false);
        await cancelBooking(idToCancel, dispatch)
    }



    return (
        <>
            <div className="userpage-wrapper">
                <div className="userpage-hero">
                    <div className="userpage-profile-card">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <div className="userpage-avatar">
                                    {store.user?.name?.[0] || <i className="fa-solid fa-user"></i>}
                                </div>
                            </div>
                            <div className="col mt-3 mt-md-0">
                                <h2 className="userpage-username">
                                    {store.user?.user_name || "usuario_camper"}
                                </h2>
                                <p className="userpage-info-item mb-1">
                                    <i className="fa-solid fa-at me-2 text-success"></i>
                                    {store.user?.name || "Viajero"} {store.user?.last_name || ""}
                                </p>
                                <p className="userpage-info-item mb-1">
                                    <i className="fa-solid fa-envelope me-2 text-success"></i>
                                    {store.user?.email}
                                </p>
                                {store.user?.phone && (
                                    <p className="userpage-info-item mb-1">
                                        <i className="fa-solid fa-phone me-2 text-success"></i>
                                        {store.user?.phone}
                                    </p>
                                )}
                                {store.user?.address && (
                                    <p className="userpage-info-item mb-0">
                                        <i className="fa-solid fa-house me-2 text-success"></i>
                                        {store.user?.address}
                                    </p>
                                )}
                            </div>
                            <div className="col-12 col-md-auto mt-3 mt-md-0">
                                <button
                                    className="userpage-edit-btn"
                                    onClick={() => setShowEditModal(true)}
                                >
                                    <i className="fa-solid fa-pen-to-square me-2"></i>
                                    Editar Perfil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="userpage-content">
                    <div className="userpage-content-inner">
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <h4 className="userpage-section-title reservas">
                                    <i className="fa-solid fa-calendar-check me-2 text-success"></i>
                                    Mis Reservas
                                </h4>
                                <div className="d-flex flex-column gap-3">
                                    {reservas.length > 0 ? reservas.map(res => (
                                        <div className="userpage-card reserva" key={res.booking_id}>
                                            <div className="row g-0 align-items-center">

                                                {/* 👇 Imagen con padding */}
                                                <div className="col-4 userpage-card-img-wrapper">
                                                    <img
                                                        src={res.van_img || "https://via.placeholder.com/150"}
                                                        alt="Van"
                                                    />
                                                </div>

                                                <div className="col-8 userpage-card-body">
                                                    <h6 className="userpage-card-title">
                                                        {res.van_brand} {res.van_model}
                                                    </h6>
                                                    <p className="userpage-card-info">
                                                        <i className="fa-solid fa-calendar-days me-1 text-success"></i>
                                                        {res.start_date} → {res.end_date}
                                                    </p>
                                                    <p className="userpage-card-info">
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
                                                        <div className="d-flex gap-2">
                                                            {/* 👇 Botón ver detalle */}
                                                            <Link
                                                                to={`/vans/${res.car_id}`}
                                                                className="userpage-detail-btn"
                                                            >
                                                                <i className="fa-solid fa-eye me-1"></i>
                                                                Ver
                                                            </Link>
                                                            {res.status !== "cancelled" && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger rounded-pill"
                                                                    onClick={() => setBookingToCancel(res.booking_id)}
                                                                >
                                                                    <i className="fa-solid fa-xmark me-1"></i>
                                                                    Cancelar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="userpage-empty reservas">
                                            <i className="fa-solid fa-calendar-xmark fa-2x mb-3 d-block opacity-25"></i>
                                            Aún no tienes reservas.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h4 className="userpage-section-title favoritos">
                                    <i className="fa-solid fa-heart me-2 text-danger"></i>
                                    Favoritos
                                </h4>
                                <div className="d-flex flex-column gap-3">
                                    {favSpots.length > 0 ? favSpots.map(spot => (
                                        <div className="userpage-card favorito" key={spot.spot_id}>
                                            <div className="row g-0 align-items-center">
                                                <div className="col-4">
                                                    <img
                                                        src={spot.media?.[0]?.url || "https://via.placeholder.com/150"}
                                                        alt={spot.name}
                                                    />
                                                </div>
                                                <div className="col-8 userpage-card-body">
                                                    <h6 className="userpage-card-title">{spot.name}</h6>
                                                    <p className="userpage-card-info">
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
                                        <div className="userpage-empty favoritos">
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

            {/* ── MODAL CANCELAR — sin createPortal ── */}
            {bookingToCancel && (
                <div className="userpage-modal-overlay">
                    <div className="userpage-modal-box">
                        <div className="userpage-modal-header">
                            <h5 className="fw-bold">
                                <i className="fa-solid fa-triangle-exclamation text-warning me-2"></i>
                                Cancelar reserva
                            </h5>
                        </div>
                        <div className="userpage-modal-body">
                            ¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.
                        </div>
                        <div className="userpage-modal-footer">
                            <button
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={() => setBookingToCancel(null)}
                                disabled={cancelling}
                            >
                                Volver
                            </button>
                            <button
                                className="btn btn-danger rounded-pill px-4"
                                onClick={handleConfirmCancel}
                                disabled={cancelling}
                            >
                                {cancelling
                                    ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Cancelando...</>
                                    : <><i className="fa-solid fa-xmark me-2"></i>Sí, cancelar</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <WelcomeModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </>
    );
};