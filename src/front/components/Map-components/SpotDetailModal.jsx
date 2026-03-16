import React, { useState, useEffect } from 'react';
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { 
    getSpotById, 
    createSpot, 
    getAllComments, 
    createComment, 
    updateComment, 
    deleteComment 
} from '../../services/spotServices';

export const SpotDetailModal = ({ spotId, externalData, onClose, onSuccess, allSpots, onOpenDetail }) => {
    const { store } = useGlobalReducer();
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    // Identificador del usuario logueado (sacado de localStorage)
    const currentUserId = localStorage.getItem("user_id") || store.user?.id;

    // Estados para el Spot
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("parking");
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);

    const [hasWater, setHasWater] = useState(false);
    const [hasWaste, setHasWaste] = useState(false);
    const [hasLight, setHasLight] = useState(false);
    const [isSleepable, setIsSleepable] = useState(false);

    // Estados para nueva reseña
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [errorMessage, setErrorMessage] = useState("");

    // Estados para edición
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);

    const isExternal = typeof spotId === 'string' && !spotId.startsWith('db-');
    const isNewManualSpot = String(spotId).startsWith('new-');

    const autoGrow = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = (e.target.scrollHeight) + "px";
    };

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
            if (isNewManualSpot) {
                setName("");
                setAddress("");
            } else {
                setName(externalData?.name || "Sitio sin nombre");
                setAddress(externalData?.address || "Dirección no disponible");
            }
            setCategory(externalData?.category || "parking");
            setLat(externalData?.latitude);
            setLng(externalData?.longitude);
            setDescription("");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadDetail();
    }, [spotId, isExternal, externalData, isNewManualSpot]);

    const startEditing = (comment) => {
        setEditingId(comment.coment_id);
        setEditText(comment.coment_text);
        setEditRating(comment.rating);
    };

    const handleSaveEdit = async (id) => {
        const success = await updateComment(id, editText, editRating);
        if (success) {
            setEditingId(null);
            await loadDetail(); 
            alert("Reseña actualizada");
        } else {
            setErrorMessage("❌ Error al actualizar la reseña");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres borrar esta reseña?")) {
            const success = await deleteComment(id);
            if (success) {
                await loadDetail();
                alert("Reseña eliminada");
            } else {
                setErrorMessage("❌ No tienes permiso para borrar esto");
            }
        }
    };

    const handleAction = async () => {
        setErrorMessage("");
        if (isNewManualSpot && !name.trim()) {
            setErrorMessage("⚠️ El nombre del sitio es obligatorio.");
            return;
        }

        if (!newComment.trim() && !isNewManualSpot) {
            setErrorMessage("⚠️ Por favor, escribe un comentario para tu reseña.");
            return;
        }

        const data = {
            name, address, description,
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
                alert("¡Lugar guardado!");
                if (onSuccess) await onSuccess();
                if (onOpenDetail) onOpenDetail(`db-${result.spot_id}`);
            } else {
                setErrorMessage("❌ Error al guardar.");
            }
        } else {
            const cleanId = String(spotId).replace('db-', '');
            const success = await createComment(cleanId, newComment, newRating);
            if (success) {
                setNewComment("");
                setNewRating(5);
                await loadDetail();
                alert("¡Reseña añadida!");
                if (onSuccess) await onSuccess();
            } else {
                setErrorMessage("❌ Inicia sesión para comentar.");
            }
        }
    };

    if (!spotId) return null;

    return (
        <div 
            className="modal d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }} 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content shadow-lg border-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>

                    {loading ? (
                        <div className="modal-body text-center p-5"><div className="spinner-border text-success"></div></div>
                    ) : (
                        <>
                            <div className="position-relative">
                                {spot?.media?.[0]?.url || imageUrl ? (
                                    <img src={spot?.media?.[0]?.url || imageUrl} className="img-fluid w-100" style={{ height: '250px', objectFit: 'cover' }} alt="Lugar" />
                                ) : (
                                    <div className="bg-light d-flex flex-column align-items-center justify-content-center" style={{ height: '150px' }}>
                                        <span style={{ fontSize: '2rem' }}>{isNewManualSpot ? '🆕' : '📷'}</span>
                                        <span className="text-muted small">Sin imagen</span>
                                    </div>
                                )}
                                <button className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 rounded-circle shadow-sm" onClick={onClose}></button>
                            </div>

                            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="mb-3">
                                    {isNewManualSpot ? (
                                        <select className="form-select form-select-sm border-0 bg-success bg-opacity-10 text-success fw-bold w-auto mb-2" value={category} onChange={e => setCategory(e.target.value)}>
                                            <option value="campground">🏕️ Área y Camping</option>
                                            <option value="parking">🅿️ Parking</option>
                                            <option value="water_waste">💧 Vaciado y Agua</option>
                                            <option value="gas_station">⛽ Gasolinera</option>
                                            <option value="supermarket">🛒 Supermercado</option>
                                        </select>
                                    ) : (
                                        <div className="badge bg-success bg-opacity-10 text-success fw-bold p-2 mb-2">
                                            {category === "parking" && "🅿️ Parking"}
                                            {category === "campground" && "🏕️ Área y Camping"}
                                            {category === "water_waste" && "💧 Vaciado y Agua"}
                                            {category === "gas_station" && "⛽ Gasolinera"}
                                            {category === "supermarket" && "🛒 Supermercado"}
                                        </div>
                                    )}

                                    {isNewManualSpot ? (
                                        <input className="form-control fw-bold h4 border-bottom mb-2" placeholder="Nombre del sitio..." value={name} onChange={e => setName(e.target.value)} autoFocus />
                                    ) : (
                                        <h4 className="fw-bold mb-1">{name}</h4>
                                    )}

                                    {isNewManualSpot ? (
                                        <div className="input-group input-group-sm mb-2">
                                            <span className="input-group-text bg-light border-0">📍</span>
                                            <input className="form-control form-control-sm border-bottom" placeholder="Dirección exacta..." value={address} onChange={e => setAddress(e.target.value)} />
                                        </div>
                                    ) : (
                                        <p className="text-muted small">📍 {address}</p>
                                    )}
                                </div>

                                <hr />

                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Servicios</h6>
                                <div className="row g-2 text-center mb-4">
                                    {[
                                        { state: hasWater, setter: setHasWater, label: "💧 Agua" },
                                        { state: hasWaste, setter: setHasWaste, label: "🗑️ Vaciado" },
                                        { state: hasLight, setter: setHasLight, label: "⚡ Luz" },
                                        { state: isSleepable, setter: setIsSleepable, label: "🚐 Pernocta" }
                                    ].map((service, idx) => (
                                        <div className="col-3" key={idx}>
                                            <div
                                                onClick={() => isNewManualSpot && service.setter(!service.state)}
                                                className={`p-2 rounded small ${service.state ? 'bg-success text-white fw-bold' : 'bg-light text-muted border'}`}
                                                style={{ cursor: isNewManualSpot ? 'pointer' : 'default' }}
                                            >
                                                {service.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Descripción</h6>
                                {isNewManualSpot ? (
                                    <textarea className="form-control bg-light mb-4 p-3" rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción..." />
                                ) : (
                                    <div className="p-3 bg-light rounded mb-4" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                                        {description || "Sin descripción disponible."}
                                    </div>
                                )}

                                {!isNewManualSpot && (
                                    <div className="bg-light p-3 rounded border mb-4 shadow-sm">
                                        <h6 className="fw-bold small mb-3 text-uppercase">Tu Opinión</h6>
                                        <div className="d-flex gap-2">
                                            <select className="form-select form-select-sm w-25 border-0 shadow-sm" value={newRating} onChange={e => setNewRating(parseInt(e.target.value))}>
                                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                            </select>
                                            <textarea className="form-control form-control-sm border-0 shadow-sm" rows="1" value={newComment} onChange={e => { setNewComment(e.target.value); autoGrow(e); }} placeholder="Escribe tu reseña..." />
                                        </div>
                                    </div>
                                )}

                                {!isExternal && comments.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-3">Reseñas</h6>
                                        {comments.map(comment => {
                                            // logica de autor
                                            const isOwner = String(comment.user_id) === String(currentUserId);

                                            return (
                                                <div key={comment.coment_id} className="small bg-white p-3 rounded mb-2 border shadow-sm border-start border-success border-3">
                                                    
                                                    {editingId === comment.coment_id ? (
                                                        <div>
                                                            <select className="form-select form-select-sm mb-2" value={editRating} onChange={e => setEditRating(parseInt(e.target.value))}>
                                                                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                                            </select>
                                                            <textarea className="form-control form-control-sm mb-2" value={editText} onChange={e => setEditText(e.target.value)} />
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button className="btn btn-sm btn-success" onClick={() => handleSaveEdit(comment.coment_id)}>Guardar</button>
                                                                <button className="btn btn-sm btn-light" onClick={() => setEditingId(null)}>Cancelar</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        
                                                        <>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <strong>{comment.user_name || "Usuario"}</strong>
                                                                <div className="d-flex gap-2 align-items-center">
                                                                    <span className="text-warning">{"★".repeat(comment.rating)}</span>
                                                                    
                                                                    {isOwner && (
                                                                        <div className="d-flex gap-1 ms-2">
                                                                            <button className="btn btn-sm p-0 border-0 opacity-75" onClick={() => startEditing(comment)} title="Editar">✏️</button>
                                                                            <button className="btn btn-sm p-0 border-0 opacity-75" onClick={() => handleDelete(comment.coment_id)} title="Borrar">🗑️</button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-secondary mt-1">{comment.coment_text}</div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {errorMessage && <div className="alert alert-danger py-2 small fw-bold text-center mb-3">{errorMessage}</div>}

                                <button className="btn btn-success w-100 fw-bold py-2 shadow-sm" onClick={handleAction}>
                                    {isNewManualSpot ? "🚀 PUBLICAR SITIO" : (isExternal ? "➕ GUARDAR SITIO" : "ENVIAR RESEÑA")}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};