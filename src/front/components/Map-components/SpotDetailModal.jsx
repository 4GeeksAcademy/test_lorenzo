import React, { useState, useEffect } from 'react';
import { getSpotById, createSpot } from '../../services/spotServices';

export const SpotDetailModal = ({ spotId, onClose }) => {
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Estados para los campos editables (Inputs)
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

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
                
                // Rellenamos estados por si acaso, aunque no los editemos aquí
                setName(data?.name || "");
                setAddress(data?.address || "");
                setDescription(data?.description || "");
            } else {
                // CASO 2: Es de Mapbox (API EXTERNA)
                // Usamos valores temporales. Nota: Map.jsx debería pasar coords reales si es posible.
                const tempSpot = {
                    name: "Nombre del sitio", 
                    address: "Dirección por confirmar",
                    category: "parking",
                    isExternal: true,
                    latitude: 40.4167, 
                    longitude: -3.7037
                };
                
                setSpot(tempSpot);
                setName(tempSpot.name);
                setAddress(tempSpot.address);
                setDescription(""); 
            }
            setLoading(false);
        };
        loadDetail();
    }, [spotId, isExternal]);

    if (!spotId) return null;

    const handleSaveToCommunity = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para añadir lugares a la comunidad.");
            return;
        }

        // Enviamos los estados que el usuario ha podido editar
        const newSpot = {
            name: name,
            category: spot?.category || "parking",
            latitude: spot?.latitude || 40.4167,
            longitude: spot?.longitude || -3.7037,
            address: address,
            description: description,
            is_sleepable: true
            // Si tu backend acepta imageUrl, añádela aquí también
        };

        const result = await createSpot(newSpot);

        if (result) {
            alert("¡Genial! Has añadido un nuevo lugar.");
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
                                            {isExternal ? 'Punto pendiente de registro' : 'Sin fotos disponibles'}
                                        </p>
                                    </div>
                                )}
                                <button type="button" className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 shadow-sm rounded-circle" onClick={onClose}></button>
                            </div>

                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <span className="badge bg-success bg-opacity-75 mb-2">
                                        {isExternal ? 'Nueva entrada' : spot?.category}
                                    </span>
                                    
                                    {/* Campos Editables para externos */}
                                    {isExternal ? (
                                        <div className="d-flex flex-column gap-2">
                                            <input 
                                                className="form-control fw-bold h4 mb-0" 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Nombre del lugar"
                                            />
                                            <input 
                                                className="form-control form-control-sm" 
                                                value={address} 
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="Dirección"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="modal-title h4 fw-bold text-dark">{spot?.name}</h2>
                                            <p className="text-muted small mb-0">📍 {spot?.address}</p>
                                        </>
                                    )}
                                </div>

                                <hr />

                                <div className="mb-4">
                                    <h6 className="fw-bold text-dark">Descripción</h6>
                                    {isExternal ? (
                                        <textarea 
                                            className="form-control form-control-sm"
                                            rows="3"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Añade detalles sobre el lugar..."
                                        />
                                    ) : (
                                        <p className="text-secondary small">
                                            {spot?.description || "Lugar verificado por la comunidad."}
                                        </p>
                                    )}
                                </div>

                                {!isExternal ? (
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
                                ) : (
                                    <div className="p-3 border rounded bg-light">
                                        <label className="form-label small fw-bold text-muted mb-1">URL de la foto (opcional):</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="https://ejemplo.com/foto.jpg"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer bg-light border-0 px-4 py-3" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
                                {isExternal ? (
                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Personaliza los datos antes de guardar</span>
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