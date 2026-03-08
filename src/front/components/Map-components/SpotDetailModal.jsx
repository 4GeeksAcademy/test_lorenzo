import React, { useState, useEffect } from 'react';
import { getSpotById, createSpot } from '../../services/spotServices';

export const SpotDetailModal = ({ spotId, onClose }) => {
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);

    // Identificamos si el origen es Mapbox o nuestra DB
    const isExternal = typeof spotId === 'string' && !spotId.startsWith('db-');

    useEffect(() => {
        const loadDetail = async () => {
            if (!spotId) return;
            setLoading(true);

            if (!isExternal) {
                // CASO 1: Es de nuestra base de datos
                const cleanId = typeof spotId === 'string' ? spotId.replace('db-', '') : spotId;
                const data = await getSpotById(cleanId);
                setSpot(data);
            } else {
                // CASO 2: Es de Mapbox (API EXTERNA)
                // Buscamos los datos básicos que Mapbox ya cargó en el mapa
                // Si tienes un estado global con todos los resultados, podrías buscarlo aquí.
                // Por ahora, creamos el objeto temporal para que no explote el render.
                setSpot({
                    name: "Lugar de Mapbox",
                    address: "Dirección de la zona",
                    category: "parking",
                    isExternal: true
                });
            }
            setLoading(false);
        };
        loadDetail();
    }, [spotId, isExternal]);

    if (!spotId) return null;

    const handleSaveToCommunity = async () => {
        // Obtenemos el token para avisar al usuario ANTES de enviar si no está logueado
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para añadir lugares a la comunidad.");
            return;
        }

        const newSpot = {
            name: spot?.name || "Lugar nuevo",
            category: spot?.category || "parking",
            // IMPORTANTE: Asegúrate de que tu Map.jsx esté pasando las coordenadas
            // Si spot no las tiene, el backend dará error 400.
            latitude: spot?.latitude || 40.4167, 
            longitude: spot?.longitude || -3.7037,
            address: spot?.address || "Añadido desde el mapa",
            description: "Registrado desde búsqueda externa de Mapbox",
            is_sleepable: true 
        };

        const result = await createSpot(newSpot);
        
        if (result) {
            alert("¡Genial! Has añadido un nuevo lugar.");
            // Recargamos para que el pin cambie de color (de externo a comunidad)
            window.location.reload(); 
            onClose();
        } else {
            alert("No se pudo guardar. Revisa si tu sesión sigue activa.");
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px' }}>
                    
                    {loading ? (
                        <div className="modal-body text-center p-5">
                            <div className="spinner-border text-success" role="status"></div>
                            <p className="mt-2 text-muted">Cargando información...</p>
                        </div>
                    ) : (
                        <>
                            {/* Cabecera con Imagen */}
                            <div className="position-relative">
                                {spot?.media?.[0] ? (
                                    <img 
                                        src={spot.media[0].url} 
                                        className="img-fluid w-100" 
                                        style={{ height: '350px', objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} 
                                        alt={spot.name} 
                                    />
                                ) : (
                                    <div className="bg-light d-flex flex-column align-items-center justify-content-center" style={{ height: '250px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                                        <span style={{ fontSize: '3rem' }}>{isExternal ? '📍' : '📷'}</span>
                                        <p className="text-muted fw-bold mt-2">
                                            {isExternal ? 'Este punto aún no tiene fotos' : 'Sin fotos disponibles'}
                                        </p>
                                    </div>
                                )}
                                <button type="button" className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 shadow-sm rounded-circle" onClick={onClose}></button>
                            </div>

                            <div className="modal-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <span className="badge bg-success bg-opacity-75 mb-2">
                                            {isExternal ? 'Sugerencia Mapbox' : spot?.category}
                                        </span>
                                        <h2 className="modal-title h4 fw-bold text-dark">{spot?.name}</h2>
                                        <p className="text-muted small mb-0">📍 {spot?.address}</p>
                                    </div>
                                    {!isExternal && (
                                        <div className="bg-warning bg-opacity-10 p-2 rounded text-center" style={{ minWidth: '60px' }}>
                                            <span className="h5 text-warning fw-bold mb-0">★ {spot?.rating?.toFixed(1) || '0.0'}</span>
                                        </div>
                                    )}
                                </div>

                                <hr />

                                <div className="mb-4">
                                    <h6 className="fw-bold text-dark">Descripción</h6>
                                    <p className="text-secondary small">
                                        {isExternal 
                                            ? "Este lugar ha sido localizado mediante la búsqueda de Mapbox. No tenemos detalles sobre servicios todavía. ¡Regístralo para completar la ficha!"
                                            : (spot?.description || "Lugar verificado por la comunidad.")}
                                    </p>
                                </div>

                                {!isExternal && (
                                    <div className="row g-2 text-center">
                                        <div className="col-3">
                                            <div className={`p-2 rounded small ${spot?.has_water ? 'bg-success bg-opacity-10 text-success' : 'bg-light text-muted'}`}>💧 Agua</div>
                                        </div>
                                        <div className="col-3">
                                            <div className={`p-2 rounded small ${spot?.has_waste_dump ? 'bg-success bg-opacity-10 text-success' : 'bg-light text-muted'}`}>🗑️ Vaciado</div>
                                        </div>
                                        <div className="col-3">
                                            <div className={`p-2 rounded small ${spot?.has_electricity ? 'bg-success bg-opacity-10 text-success' : 'bg-light text-muted'}`}>⚡ Luz</div>
                                        </div>
                                        <div className="col-3">
                                            <div className={`p-2 rounded small ${spot?.is_sleepable ? 'bg-success bg-opacity-10 text-success' : 'bg-light text-muted'}`}>🚐 Pernocta</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer con lógica de registro */}
                            <div className="modal-footer bg-light border-0 px-4 py-3" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
                                {isExternal ? (
                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">¿Conoces este sitio?</span>
                                        <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={handleSaveToCommunity}>
                                            ➕ Añadir a la comunidad
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                        <small className="text-muted text-truncate">Publicado por: <strong>{spot?.userName || 'Usuario'}</strong></small>
                                        <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>Cerrar</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};