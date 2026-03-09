import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { getSingleVan } from "../services/vanServices"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, format } from "date-fns";
import { addBooking } from "../services/bookingServices";

export const DetailsVan = () => {

    const { id } = useParams()
    const [van, setVan] = useState()
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(true)
    const { store, dispatch } = useGlobalReducer()

    const days = endDate ? differenceInDays(endDate, startDate) : 0;
    const bookingTotal = days * parseFloat(van?.price_per_day)

    const blockBooking = van?.booking?.map(item => {
        const start = new Date(item.start_date);
        const end = new Date(item.end_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return {
            start: start,
            end: end
        };
    })

    const getVan = async () => {
        const vanData = await getSingleVan(id)
        setVan(vanData)
        setLoading(false)
        console.log(vanData);
        
    }

    const handleBooking = async () => {
        const bookingData = {
            car_id: id,
            user_id: 1,
            start_date: format(startDate, "yyyy-MM-dd"),
            end_date: format(endDate, "yyyy-MM-dd"),
            total_price: bookingTotal,
            status: "confirmed"
        };

        const response = await addBooking(bookingData, dispatch)
        if (response) {
            setStartDate(null)
            setEndDate(null)
            getVan()
        }
    }

    const handleChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const handleFavVan = () => {
        const isFav = store.fav_vans.find(fav => fav.id === van.id);
        if (isFav) {
            const updatedFavs = store.fav_vans.filter(fav => fav.id !== van.id);
            dispatch({ type: 'fav_vans', payload: updatedFavs });
        } else {
            dispatch({ type: 'fav_vans', payload: [...store.fav_vans, van] });
        }
    };

    useEffect(() => {
        getVan()
    }, [id])

    return (
        <>
            {loading ? (
                <span className="d-flex aling-item-center justify-content-center vh-100">
                    <span className="p-2"> Loading...</span>
                    <span className="spinner-border p-2 flex-shrink-1" role="status"></span>
                </span>
            ) : (
                <div className="container mt-5 mb-5">
                    <div className="row g-3 mb-4">
                        <div className="col-md-8">
                            <img
                                src={van.media?.[0].url_vehicle}
                                className="img-fluid rounded-3 shadow-sm w-100"
                                style={{ height: "450px", objectFit: "cover" }}
                                alt="Principal"
                            />
                        </div>
                        <div className="col-md-4 d-flex flex-column gap-3">
                            <img
                                src={van.media?.[1].url_vehicle}
                                className="img-fluid rounded-3 shadow-sm h-50"
                                style={{ objectFit: "cover" }}
                                alt="Interior 1"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h1 className="display-5 fw-bold text-uppercase mb-0">{van.brand}</h1>
                                        <h3 className="text-muted">{van.model}</h3>
                                    </div>
                                    <span className={`badge ${van.available ? 'bg-success' : 'bg-danger'} p-2`}>
                                        {van.available ? 'Disponible' : 'No disponible'}
                                    </span>
                                </div>
                                <div className="d-flex flex-wrap gap-2 my-4">
                                    <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                                        <i className="fa-solid fa-users me-2"></i>{van.capacity} Plazas
                                    </span>
                                    <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                                        <i className="fa-solid fa-van-shuttle me-2"></i>{van.type_vehicle}
                                    </span>
                                    <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
                                        <i className="fa-solid fa-euro-sign me-2"></i>{van.price_per_day}/día
                                    </span>
                                </div>
                                <hr />
                                <h4 className="fw-bold">Descripción</h4>
                                <p className="text-muted" style={{ lineHeight: "1.8" }}>
                                    {van.description}
                                </p>
                            </div>
                            <div className="card border-0 shadow-sm p-4">
                                <h5 className="fw-bold text-primary mb-3">Condiciones de Alquiler</h5>
                                <ul className="small text-secondary">
                                    <li>Kilometraje ilimitado para reservas de más de 7 días.</li>
                                    <li>Seguro a todo riesgo con franquicia.</li>
                                    <li>Asistencia en carretera 24/7.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-lg p-4" style={{ top: "20px" }}>
                                <h3 className="fw-bold mb-4 text-center">Reservar</h3>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Selecciona tus fechas</label>
                                    <div className="datepicker d-flex justify-content-center border rounded-3 p-2 bg-light">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleChange}
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={new Date()}
                                            selectsRange
                                            selectsStart
                                            excludeDateIntervals={blockBooking}
                                            disabled={!van.available}
                                            placeholderText={van.available ? "SELECCIONA FECHAS" : "NO DISPONIBLE"}
                                            className="form-control text-center"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Precio por día</span>
                                    <span className="fw-bold">{van.price_per_day}€</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Noches</span>
                                    <span className="fw-bold">{days}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="h5 fw-bold">Total</span>
                                    <span className="h4 fw-bold text-primary">
                                        {days > 0 ? bookingTotal : parseFloat(van.price_per_day)}€
                                    </span>
                                </div>

                                <button
                                    className="btn btn-primary btn-lg w-100 fw-bold py-3 mb-3 shadow"
                                    disabled={!van.available || !endDate}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalReserva"
                                >
                                    {van.available ? 'RESERVAR AHORA' : 'NO DISPONIBLE'}
                                </button>

                                <div className="modal fade" id="modalReserva" tabIndex="-1" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Confirmar Reserva</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <p>¿Estás seguro de que deseas reservar la <strong>{van.model}</strong>?</p>
                                                <ul>
                                                    <li><strong>Desde:</strong> {startDate?.toLocaleDateString()}</li>
                                                    <li><strong>Hasta:</strong> {endDate?.toLocaleDateString()}</li>
                                                </ul>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleBooking}
                                                    data-bs-dismiss="modal"
                                                >
                                                    Confirmar y Pagar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={`btn w-100 border-2 ${store.fav_vans.some(item => item.id === van.id) ? 'btn-danger' : 'btn-outline-danger'}`}
                                    onClick={handleFavVan}
                                >
                                    <i className={`${store.fav_vans.some(item => item.id === van.id) ? 'fa-solid' : 'fa-regular'} fa-heart me-2`}></i>
                                    {store.fav_vans.some(item => item.id === van.id) ? 'En favoritos' : 'Añadir a favoritos'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}