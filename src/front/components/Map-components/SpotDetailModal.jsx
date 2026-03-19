import React, { useState, useEffect } from 'react';
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import {
    getSpotById,
    createSpot,
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
    addSpotMedia
} from '../../services/spotServices';

export const SpotDetailModal = ({ spotId, externalData, onClose, onSuccess, allSpots, onOpenDetail }) => {
    const { store } = useGlobalReducer();
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    const isAuthenticated = !!localStorage.getItem("token");
    const currentUserId = localStorage.getItem("user_id") || store.user?.id;

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

    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const isExternal = typeof spotId === 'string' && !spotId.startsWith('db-');
    const isNewManualSpot = String(spotId).startsWith('new-');
    const isTrustworthy = comments.length >= 3;

    const autoGrow = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = (e.target.scrollHeight) + "px";
    };

    const loadDetail = async () => {
        if (!spotId) return;
        setLoading(true);
        setImageUrl("");
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
            setName(isNewManualSpot ? "" : (externalData?.name || ""));
            setAddress(externalData?.address || "");
            setCategory(externalData?.category || "parking");
            setLat(externalData?.latitude);
            setLng(externalData?.longitude);
            setDescription("");
            setHasWater(false);
            setHasWaste(false);
            setHasLight(false);
            setIsSleepable(false);
            setSpot(null);
            setComments([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadDetail();
    }, [spotId, isExternal, externalData, isNewManualSpot]);

    const handleAction = async () => {
        if (!isAuthenticated) return;
        setErrorMessage("");
        if (isNewManualSpot && !name.trim()) {
            setErrorMessage("⚠️ El nombre es obligatorio.");
            return;
        }

        const data = {
            name, address, description,
            image_url: imageUrl,
            category, has_water: hasWater,
            has_waste_dump: hasWaste, has_electricity: hasLight,
            is_sleepable: isSleepable, latitude: lat, longitude: lng
        };

        if (isExternal) {
            const result = await createSpot(data);
            if (result) {
                alert("¡Lugar guardado!");
                if (onSuccess) await onSuccess();
                if (onOpenDetail) onOpenDetail(`db-${result.spot_id}`);
            }
        } else {
            const cleanId = String(spotId).replace('db-', '');
            if (editingId) {
                const successUpdate = await updateComment(editingId, newComment, newRating);
                if (successUpdate) {
                    setEditingId(null);
                    setNewComment("");
                    setNewRating(5);
                    await loadDetail();
                }
            } else {
                const successComment = await createComment(cleanId, newComment, newRating);
                if (successComment) {
                    if (imageUrl.trim() !== "" && !spot?.media?.some(m => m.url === imageUrl)) {
                        await addSpotMedia(cleanId, imageUrl);
                    }
                    setNewComment("");
                    setNewRating(5);
                    setImageUrl("");
                    alert("¡Reseña publicada con éxito!");
                    if (onSuccess) await onSuccess();
                    await loadDetail();
                }
            }
        }
    };

    const startEditing = (comment) => {
        setEditingId(comment.coment_id);
        setNewComment(comment.coment_text);
        setNewRating(comment.rating);
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) modalBody.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres borrar esta reseña?")) {
            const success = await deleteComment(id);
            if (success) {
                await loadDetail();
            } else {
                setErrorMessage("❌ No tienes permiso para borrar esto");
            }
        }
    };

    const changeImage = (direction) => {
        if (!spot?.media || spot.media.length <= 1) return;
        const currentUrl = imageUrl || spot.media[0].url;
        const currentIndex = spot.media.findIndex(m => m.url === currentUrl);
        let nextIndex = currentIndex + direction;
        if (nextIndex >= spot.media.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = spot.media.length - 1;
        setImageUrl(spot.media[nextIndex].url);
    };

    if (!spotId) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content shadow-lg border-0" style={{ borderRadius: '10px', overflow: 'hidden' }}>

                    {loading ? (
                        <div className="modal-body text-center p-5"><div className="spinner-border text-success"></div></div>
                    ) : (
                        <>
                            <div className="position-relative">
                                {imageUrl || spot?.media?.[0]?.url ? (
                                    <img src={imageUrl || spot?.media?.[0]?.url} className="img-fluid w-100" style={{ height: '300px', objectFit: 'cover' }} alt="Lugar" />
                                ) : (
                                    <div className="bg-light d-flex flex-column align-items-center justify-content-center" style={{ height: '200px' }}>
                                        <span style={{ fontSize: '3rem' }}>{isNewManualSpot ? '🆕' : '📷'}</span>
                                    </div>
                                )}

                                {spot?.media?.length > 1 && (
                                    <>
                                        <button className="btn btn-dark btn-sm position-absolute top-50 start-0 translate-middle-y m-2 opacity-75 rounded-circle" style={{ width: '35px', height: '35px', zIndex: 10 }} onClick={() => changeImage(-1)}>❮</button>
                                        <button className="btn btn-dark btn-sm position-absolute top-50 end-0 translate-middle-y m-2 opacity-75 rounded-circle" style={{ width: '35px', height: '35px', zIndex: 10 }} onClick={() => changeImage(1)}>❯</button>
                                    </>
                                )}
                                <button
                                    className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 rounded-circle shadow-sm"
                                    style={{ zIndex: 11 }}
                                    onClick={() => {
                                        setImageUrl("");
                                        onClose();
                                    }}
                                ></button>
                            </div>

                            {spot?.media?.length > 0 && (
                                <div className="d-flex gap-2 overflow-auto p-2 bg-light border-bottom border-top" style={{ whiteSpace: 'nowrap' }}>
                                    {spot.media.map((img, index) => (
                                        <img key={index} src={img.url} onClick={() => setImageUrl(img.url)} style={{ width: '65px', height: '45px', objectFit: 'cover', cursor: 'pointer', borderRadius: '5px', flex: '0 0 auto' }} className={`border ${imageUrl === img.url ? 'border-success border-2' : ''}`} />
                                    ))}
                                </div>
                            )}

                            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="mb-3">
                                    {isNewManualSpot ? (
                                        <select
                                            className="form-select form-select-sm border-0 bg-success bg-opacity-10 text-success fw-bold w-auto mb-2"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                        >
                                            <option value="campground">🏕️ Área y Camping</option>
                                            <option value="parking">🅿️ Parking</option>
                                            <option value="water_waste">💧 Vaciado y Agua</option>
                                            <option value="gas_station">⛽ Gasolinera</option>
                                            <option value="supermarket">🛒 Supermercado</option>
                                        </select>
                                    ) : (
                                        <div className="badge bg-success bg-opacity-10 text-success fw-bold p-2 mb-2 text-uppercase">
                                            {category.replace('_', ' ')}
                                        </div>
                                    )}

                                    {isNewManualSpot ? (
                                        <input
                                            className="form-control fw-bold h4 border-bottom mb-2 bg-transparent shadow-none border-0 ps-0"
                                            placeholder="Nombre del sitio..."
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        <h4 className="fw-bold mb-1">{name}</h4>
                                    )}

                                    {isNewManualSpot ? (
                                        <div className="input-group input-group-sm mb-1">
                                            <span className="input-group-text bg-transparent border-0 ps-0">📍</span>
                                            <input
                                                className="form-control form-control-sm border-bottom bg-transparent shadow-none border-0"
                                                placeholder="Escribe la dirección o ubicación..."
                                                value={address}
                                                onChange={e => setAddress(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-muted small mb-1">📍 {address}</p>
                                    )}

                                    {!isExternal && !isNewManualSpot && spot && (
                                        <div className="d-flex align-items-center gap-2 mt-2">
                                            <span className="badge bg-light text-dark border fw-normal" style={{ fontSize: '0.7rem' }}>
                                                👤 Añadido por: {spot.user_name || `Usuario ${spot.user_id}`}
                                            </span>
                                            {isTrustworthy ? (
                                                <span className="badge bg-success shadow-sm" style={{ fontSize: '0.7rem' }}>✅ Sitio Confiable</span>
                                            ) : (
                                                <span className="badge bg-light text-muted border fw-normal" style={{ fontSize: '0.7rem' }}>⏳ Verificando sitio...</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <hr />

                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Servicios</h6>
                                <div className="row g-2 text-center mb-4">
                                    {[{ state: hasWater, setter: setHasWater, label: "💧 Agua" }, { state: hasWaste, setter: setHasWaste, label: "🗑️ Vaciado" }, { state: hasLight, setter: setHasLight, label: "⚡ Luz" }, { state: isSleepable, setter: setIsSleepable, label: "🚐 Pernocta" }].map((service, idx) => (
                                        <div className="col-3" key={idx}>
                                            <div onClick={() => isNewManualSpot && service.setter(!service.state)} className={`p-2 rounded small ${service.state ? 'bg-success text-white fw-bold border border-success' : 'bg-light text-muted border'}`} style={{ cursor: isNewManualSpot ? 'pointer' : 'default' }}>{service.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Descripción</h6>
                                {isNewManualSpot ? <textarea className="form-control bg-light mb-4 p-2 border-0" rows="2" value={description} onChange={e => { setDescription(e.target.value); autoGrow(e); }} placeholder="Describe el lugar..." /> : <div className="p-3 bg-light rounded mb-4 shadow-sm" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{description || "Sin descripción disponible."}</div>}


                                {isAuthenticated ? (
                                    <div className={`p-3 rounded border mb-4 shadow-sm ${editingId ? 'bg-warning bg-opacity-10' : 'bg-light'}`}>
                                        <h6 className="fw-bold small mb-3 text-uppercase">{editingId ? '⚠️ Editando tu reseña' : 'Tu Opinión'}</h6>
                                        <div className="d-flex gap-2">
                                            <select className="form-select form-select-sm w-25 border-0 shadow-sm" value={newRating} onChange={e => setNewRating(parseInt(e.target.value))}>
                                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                            </select>
                                            <textarea className="form-control form-control-sm border-0 shadow-sm" rows="1" value={newComment} onChange={e => { setNewComment(e.target.value); autoGrow(e); }} placeholder="Escribe tu reseña..." />
                                        </div>
                                        {editingId && <button className="btn btn-link btn-sm text-danger mt-2 p-0 text-decoration-none" onClick={() => { setEditingId(null); setNewComment(""); setNewRating(5); }}>✖ Cancelar edición</button>}
                                    </div>
                                ) : (
                                    <div className="alert alert-info border-0 small text-center shadow-sm py-3 mb-4">
                                        👋 ¡Hola! Inicia sesión para dejar tu valoración y fotos.
                                    </div>
                                )}


                                {!isExternal && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-3">Reseñas de la comunidad ({comments.length})</h6>
                                        {isAuthenticated ? (
                                            comments.length > 0 ? (
                                                comments.map(comment => {
                                                    const isOwner = String(comment.user_id) === String(currentUserId);
                                                    const isBeingEdited = editingId === comment.coment_id;
                                                    return (
                                                        <div key={comment.coment_id} className={`small p-3 rounded mb-2 border shadow-sm border-start border-3 ${isBeingEdited ? 'border-warning bg-light opacity-50' : 'border-success bg-white'}`} style={{ height: '80px', overflowY: 'auto' }}>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <strong>{comment.user_name || `Usuario ${comment.user_id}`}</strong>
                                                                <div className="d-flex gap-2 align-items-center">
                                                                    <span className="text-warning">{"★".repeat(comment.rating)}</span>
                                                                    {isOwner && !isBeingEdited && (
                                                                        <div className="d-flex gap-1 ms-2">
                                                                            <button className="btn btn-sm p-0 border-0 opacity-75" onClick={() => startEditing(comment)}>✏️</button>
                                                                            <button className="btn btn-sm p-0 border-0 opacity-75" onClick={() => handleDelete(comment.coment_id)}>🗑️</button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-secondary mt-1">{isBeingEdited ? 'Modificando arriba...' : comment.coment_text}</div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-muted small text-center py-2">No hay reseñas todavía.</p>
                                            )
                                        ) : (
                                            <div className="p-4 bg-light border rounded text-center shadow-sm">
                                                <p className="text-muted small mb-3">🔒 Solo los usuarios registrados pueden ver las opiniones.</p>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button onClick={() => window.location.href = "/login"} className="btn btn-success btn-sm fw-bold px-3">Entrar</button>
                                                    <button onClick={() => window.location.href = "/signup"} className="btn btn-outline-success btn-sm fw-bold">Registrarme</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!isExternal && !isNewManualSpot && (
                                    <div className="mt-4">
                                        <label className="fw-bold small text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>
                                            📸 ¿Tienes una foto de este spot?
                                        </label>
                                        {isAuthenticated ? (
                                            <>
                                                <div className="input-group shadow-sm">
                                                    <input
                                                        className="form-control form-control-sm border-0 bg-light"
                                                        value={imageUrl}
                                                        onChange={e => setImageUrl(e.target.value)}
                                                        placeholder="Añade el link de la imagen..."
                                                    />
                                                    <button
                                                        className="btn btn-success btn-sm fw-bold px-3"
                                                        type="button"
                                                        onClick={async () => {
                                                            if (!imageUrl.trim()) return alert("Por favor, añade un link primero");
                                                            const cleanId = String(spotId).replace('db-', '');
                                                            const success = await addSpotMedia(cleanId, imageUrl);
                                                            if (success) {
                                                                setImageUrl("");
                                                                await loadDetail();
                                                                alert("¡Foto añadida!");
                                                            }
                                                        }}
                                                    >
                                                        Subir
                                                    </button>
                                                </div>
                                                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                                                    * Las fotos ayudan a otros viajeros a conocer mejor el lugar antes de ir.
                                                </p>
                                            </>

                                        ) : (

                                            <div className="p-2 bg-light rounded border text-center small text-muted">
                                                Inicia sesión para compartir tus fotos.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errorMessage && <div className="alert alert-danger py-2 small fw-bold text-center mt-3 mb-0">{errorMessage}</div>}

                                <div className="mt-4">
                                    {isAuthenticated ? (
                                        <button className="btn btn-success w-100 fw-bold py-2 shadow-sm" onClick={handleAction}>
                                            {isExternal ? "CONFIRMAR Y GUARDAR" : (editingId ? "GUARDAR CAMBIOS" : "ENVIAR / ACTUALIZAR")}
                                        </button>
                                    ) : (
                                        <div className="p-3 bg-dark text-white rounded text-center shadow-sm">
                                            <p className="small mb-2">Para guardar este sitio o colaborar, necesitas una cuenta.</p>
                                            <button onClick={() => window.location.href = "/login"} className="btn btn-success btn-sm fw-bold w-100">
                                                Identifícate ahora
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};