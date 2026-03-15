import React, { useState, useEffect } from 'react';
import { getSpotById, createSpot, getAllComments, createComment } from '../../services/spotServices';

// Añadimos onOpenDetail a las props para poder actualizar el ID tras guardar
export const SpotDetailModal = ({ spotId, externalData, onClose, onSuccess, allSpots, onOpenDetail }) => {
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    // Estados del formulario 
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("parking"); // Valor por defecto técnico

    // Coordenadas
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);

    // Estados de servicios
    const [hasWater, setHasWater] = useState(false);
    const [hasWaste, setHasWaste] = useState(false);
    const [hasLight, setHasLight] = useState(false);
    const [isSleepable, setIsSleepable] = useState(false);

    // Estados de reseña y error
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [errorMessage, setErrorMessage] = useState("");

    const isExternal = typeof spotId === 'string' && !spotId.startsWith('db-');

    const autoGrow = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = (e.target.scrollHeight) + "px";
    };

    useEffect(() => {
        const loadDetail = async () => {
            if (!spotId) return;
            setLoading(true);
            const cleanId = String(spotId).replace('db-', '');

            if (!isExternal) {
                const [spotData, allComments] = await Promise.all([
                    getSpotById(cleanId),
                    getAllComments()
                ]);
                setSpot(spotData);
                setComments(allComments.filter(comment => Number(comment.spot_id) === Number(cleanId)));

                setName(spotData?.name || "");
                setAddress(spotData?.address || "");
                setDescription(spotData?.description || "");
                setCategory(spotData?.category || "parking");
                setHasWater(spotData?.has_water || false);
                setHasWaste(spotData?.has_waste_dump || false);
                setHasLight(spotData?.has_electricity || false);
                setIsSleepable(spotData?.is_sleepable || false);
                setLat(spotData?.latitude);
                setLng(spotData?.longitude);
            } else {
                setName(externalData?.name || "Sitio sin nombre");
                setAddress(externalData?.address || "Dirección no disponible");
                setCategory("parking");
                setLat(externalData?.latitude);
                setLng(externalData?.longitude);
            }
            setLoading(false);
        };
        loadDetail();
    }, [spotId, isExternal, externalData]);

    const handleAction = async () => {
        if (!newComment.trim()) {
            setErrorMessage("⚠️ Por favor, escribe un comentario para tu reseña.");
            return;
        }
        
        setErrorMessage(""); 
        
        const data = {
            name,
            address,
            description,
            image_url: imageUrl,
            rating: newRating,
            coment_text: newComment,
            category: category,
            has_water: hasWater,
            has_waste_dump: hasWaste,
            has_electricity: hasLight,
            is_sleepable: isSleepable,
            latitude: lat,
            longitude: lng
        };

        if (isExternal) {
            const result = await createSpot(data);
            if (result) {
                alert("¡Lugar guardado en la comunidad!");
                if (onSuccess) await onSuccess();
                
                // IMPORTANTE: Tu backend devuelve 'spot_id'. Saltamos al nuevo ID de la DB
                if (onOpenDetail) {
                    onOpenDetail(`db-${result.spot_id}`);
                } else {
                    onClose();
                }
            } else {
                setErrorMessage("❌ Error al guardar. Revisa tu conexión o el usuario.");
            }
        } else {
            const cleanId = String(spotId).replace('db-', '');
            const success = await createComment(cleanId, newComment, newRating);
            
            if (success) {
                const allComments = await getAllComments();
                const updatedComments = allComments.filter(comment => 
                    Number(comment.spot_id) === Number(cleanId)
                );
                setComments(updatedComments);
                setNewComment("");
                setNewRating(5);
                alert("¡Reseña añadida!");
                if (onSuccess) await onSuccess();
            } else {
                setErrorMessage("❌ No se pudo enviar la reseña (¿estás logueado?)");
            }
        }
    };

    if (!spotId) return null;

    const isAlreadySaved = allSpots.some((savedSpot) => {
        const currentName = externalData?.name || spot?.name;
        return savedSpot.name === currentName;
    });

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content shadow-lg border-0" style={{ borderRadius: '10px' }}>

                    {loading ? (
                        <div className="modal-body text-center p-5"><div className="spinner-border text-success"></div></div>
                    ) : (
                        <>
                            <div className="position-relative">
                                {spot?.media?.[0]?.url || imageUrl ? (
                                    <img src={spot?.media?.[0]?.url || imageUrl} className="img-fluid w-100" style={{ height: '300px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} />
                                ) : (
                                    <div className="bg-light d-flex flex-column align-items-center justify-content-center" style={{ height: '200px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                                        <span style={{ fontSize: '3rem' }}>{isExternal ? '📍' : '📷'}</span>
                                    </div>
                                )}
                                <button className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 rounded-circle shadow-sm" onClick={onClose}></button>
                            </div>

                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    {/* CORRECCIÓN: Los values ahora coinciden con el Backend y el Mapa */}
                                    <select className="form-select form-select-sm border-0 bg-success bg-opacity-10 text-success fw-bold w-auto mb-2" value={category} onChange={e => setCategory(e.target.value)}>
                                        <option value="campground">🏕️ Áreas y Campings</option>
                                        <option value="parking">🅿️ Parkings</option>
                                        <option value="water_waste">💧 Vaciado y Agua</option>
                                        <option value="gas_station">⛽ Gasolineras</option>
                                        <option value="supermarket">🛒 Supermercados</option>
                                    </select>
                                    <input className="form-control fw-bold h4 border-0 p-0 shadow-none mb-1 bg-transparent" value={name} readOnly={true} />
                                    <p className="text-muted small mb-3">📍 {address}</p>
                                </div>

                                <hr />

                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Servicios</h6>
                                <div className="row g-2 text-center mb-4">
                                    <div className="col-3">
                                        <div onClick={() => setHasWater(!hasWater)} className={`p-2 rounded small ${hasWater ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted border'}`} style={{ cursor: 'pointer' }}>💧 Agua</div>
                                    </div>
                                    <div className="col-3">
                                        <div onClick={() => setHasWaste(!hasWaste)} className={`p-2 rounded small ${hasWaste ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted border'}`} style={{ cursor: 'pointer' }}>🗑️ Vaciado</div>
                                    </div>
                                    <div className="col-3">
                                        <div onClick={() => setHasLight(!hasLight)} className={`p-2 rounded small ${hasLight ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted border'}`} style={{ cursor: 'pointer' }}>⚡ Luz</div>
                                    </div>
                                    <div className="col-3">
                                        <div onClick={() => setIsSleepable(!isSleepable)} className={`p-2 rounded small ${isSleepable ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted border'}`} style={{ cursor: 'pointer' }}>🚐 Pernocta</div>
                                    </div>
                                </div>

                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Descripción</h6>
                                <textarea className="form-control border-0 bg-light mb-4" rows="1" style={{ resize: 'none', overflow: 'hidden' }} value={description} onChange={e => { setDescription(e.target.value); autoGrow(e); }} placeholder="¿Hay sombra? ¿Es tranquilo?..." />

                                <div className="bg-light p-3 rounded border mb-4 shadow-sm">
                                    <h6 className="fw-bold small mb-3 text-uppercase">Tu Opinión</h6>
                                    <div className="d-flex gap-2">
                                        <select className="form-select form-select-sm w-25 border-0 shadow-sm" value={newRating} onChange={e => setNewRating(parseInt(e.target.value))}>
                                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                        </select>
                                        <textarea className="form-control form-control-sm border-0 shadow-sm" rows="1" style={{ resize: 'none', overflow: 'hidden' }} value={newComment} onChange={e => { setNewComment(e.target.value); autoGrow(e); }} placeholder="Escribe tu reseña..." />
                                    </div>
                                </div>

                                {!isExternal && comments.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-3">Reseñas de la comunidad</h6>
                                        <div className="pe-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {comments.map(comment => (
                                                <div key={comment.coment_id} className="small bg-white p-2 rounded mb-2 border shadow-sm border-start border-success border-3">
                                                    <strong>Usuario {comment.user_id}</strong> ({comment.rating}★) - {comment.coment_text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <label className="fw-bold small text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>URL de la foto del lugar</label>
                                <input className="form-control form-control-sm border-0 bg-light mb-4" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Pega el link de la imagen aquí..." />

                                {errorMessage && (
                                    <div className="alert alert-danger py-2 small fw-bold text-center border-0 mb-3" style={{ fontSize: '0.85rem' }}>
                                        {errorMessage}
                                    </div>
                                )}

                                <button className="btn btn-success w-100 fw-bold py-2 shadow-sm" onClick={handleAction}>
                                    {isExternal && !isAlreadySaved ? "➕ CONFIRMAR Y GUARDAR SITIO" : "ENVIAR RESEÑA / ACTUALIZAR"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};