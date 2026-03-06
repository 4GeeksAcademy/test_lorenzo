import React, { useState, useEffect } from 'react';
import { getSpotById } from '../../services/spotServices';

export const SpotDetailModal = ({ spotId, onClose }) => {
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);

    // # Efecto para cargar los datos del Spot desde la base de datos
    useEffect(() => {
        const loadDetail = async () => {
            if (!spotId) return;
            setLoading(true);
            const data = await getSpotById(spotId);
            setSpot(data);
            setLoading(false);
        };
        loadDetail();
    }, [spotId]);

    if (!spotId) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content shadow-lg border-0">
                    
                    {loading ? (
                        <div className="modal-body text-center p-5">
                            <div className="spinner-border text-success" role="status"></div>
                            <p className="mt-2 text-muted">Cargando detalles del lugar...</p>
                        </div>
                    ) : spot && (
                        <>
                            {/* Cabecera con Imagen */}
                            <div className="position-relative">
                                {spot.media?.[0] ? (
                                    <img 
                                        src={spot.media[0].url} 
                                        className="img-fluid w-100" 
                                        style={{ height: '350px', objectFit: 'cover', borderTopLeftRadius: 'calc(0.5rem - 1px)', borderTopRightRadius: 'calc(0.5rem - 1px)' }} 
                                        alt={spot.name} 
                                    />
                                ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                                        <span className="text-muted">📷 Sin foto disponible</span>
                                    </div>
                                )}
                                <button type="button" className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 shadow-sm rounded-circle" onClick={onClose}></button>
                            </div>

                            {/* Contenido principal */}
                            <div className="modal-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <span className="badge bg-success bg-opacity-75 mb-2">{spot.category}</span>
                                        <h2 className="modal-title h3 fw-bold text-dark">{spot.name}</h2>
                                        <p className="text-muted small mb-0">📍 {spot.address}, {spot.city}</p>
                                    </div>
                                    <div className="bg-warning bg-opacity-10 p-2 rounded text-center" style={{ minWidth: '60px' }}>
                                        <span className="h5 text-warning fw-bold mb-0">★ {spot.rating?.toFixed(1) || 'N/A'}</span>
                                    </div>
                                </div>

                                <hr className="text-muted" />

                                <div className="mb-4">
                                    <h6 className="fw-bold text-dark">Sobre este lugar</h6>
                                    <p className="text-secondary" style={{ lineHeight: '1.6' }}>
                                        {spot.description || "Este lugar aún no tiene una descripción detallada de la comunidad."}
                                    </p>
                                </div>

                                <h6 className="fw-bold text-dark">Servicios disponibles</h6>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    <span className={`badge border px-3 py-2 ${spot.has_water ? 'text-success border-success bg-success bg-opacity-10' : 'text-muted bg-light'}`}>💧 Agua</span>
                                    <span className={`badge border px-3 py-2 ${spot.has_waste_dump ? 'text-success border-success bg-success bg-opacity-10' : 'text-muted bg-light'}`}>🗑️ Vaciado</span>
                                    <span className={`badge border px-3 py-2 ${spot.has_electricity ? 'text-success border-success bg-success bg-opacity-10' : 'text-muted bg-light'}`}>⚡ Luz</span>
                                    <span className={`badge border px-3 py-2 ${spot.is_sleepable ? 'text-success border-success bg-success bg-opacity-10' : 'text-muted bg-light'}`}>🚐 Pernocta</span>
                                </div>
                            </div>

                            {/* Pie del modal */}
                            <div className="modal-footer bg-light border-0 px-4 py-3">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <small className="text-muted">Añadido por: <strong>{spot.userName || 'Usuario anónimo'}</strong></small>
                                    <button className="btn btn-outline-success btn-sm px-4" onClick={onClose}>Cerrar</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};