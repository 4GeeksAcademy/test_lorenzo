import React, { useState, useEffect } from 'react';
import { getSpotById, createSpot, getAllComments, createComment, reportSpot } from '../../services/spotServices';

export const SpotDetailModal = ({ spotId, externalData, onClose, onSuccess, allSpots, onOpenDetail }) => {
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    // Estados del formulario 
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("parking");

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
    const isNewManualSpot = String(spotId).startsWith('new-');

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
                // CARGA DE SITIO EXISTENTE EN DB
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
                // SITIO EXTERNO (Mapbox) O MANUAL (new-)
                if (isNewManualSpot) {
                    setName("");
                    setAddress("");
                } else {
                    setName(externalData?.name || "Sitio sin nombre");
                    setAddress(externalData?.address || "Dirección no disponible");
                }
                // Las coordenadas son críticas para el POST, las sacamos de externalData
                setCategory(externalData?.category || "parking");
                setLat(externalData?.latitude);
                setLng(externalData?.longitude);
                setDescription("");
            }
            setLoading(false);
        };
        loadDetail();
    }, [spotId, isExternal, externalData, isNewManualSpot]);

    const handleReport = async () => {
        if (!localStorage.getItem('token')) {
            alert("Debes iniciar sesión para reportar un lugar.");
            return;
        }
        const confirmAction = window.confirm("¿Estás seguro de que este lugar es inseguro? Esto notificará a los administradores.");
        if (!confirmAction) return;

        const cleanId = String(spotId).replace('db-', '');
        const result = await reportSpot(cleanId, "Inseguridad detectada por usuario");

        if (result.success) {
            alert(result.msg);
        } else {
            alert("Atención: " + result.msg);
        }
    };

    const handleAction = async () => {
        // Validaciones previas
        if (isNewManualSpot && !name.trim()) {
            setErrorMessage("⚠️ El nombre del sitio es obligatorio.");
            return;
        }

        if (!newComment.trim() && !isNewManualSpot) {
            setErrorMessage("⚠️ Por favor, escribe un comentario para tu reseña.");
            return;
        }

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
                if (onOpenDetail) onOpenDetail(`db-${result.spot_id}`);
            } else {
                setErrorMessage("❌ Error al guardar. Verifica que el nombre y la categoría no estén vacíos.");
            }
        } else {
            const cleanId = String(spotId).replace('db-', '');
            const success = await createComment(cleanId, newComment, newRating);
            if (success) {
                const allComments = await getAllComments();
                setComments(allComments.filter(comment => Number(comment.spot_id) === Number(cleanId)));
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

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }} onClick={onClose}>
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
                                    {/* SELECCIÓN DE CATEGORÍA */}
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
                                        <div className="badge bg-success bg-opacity-10 text-success fw-bold p-2 mb-2">
                                            {category === "campground" && "🏕️ Áreas y Campings"}
                                            {category === "parking" && "🅿️ Parkings"}
                                            {category === "water_waste" && "💧 Vaciado y Agua"}
                                            {category === "gas_station" && "⛽ Gasolineras"}
                                            {category === "supermarket" && "🛒 Supermercados"}
                                            {!["campground", "parking", "water_waste", "gas_station", "supermarket"].includes(category) && `📍 ${category}`}
                                        </div>
                                    )}

                                    {/* NOMBRE DEL SITIO (Editable si es nuevo) */}
                                    {isNewManualSpot ? (
                                        <input
                                            className="form-control fw-bold h4 border-bottom mb-2"
                                            placeholder="Nombre del sitio..."
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        <h4 className="fw-bold mb-1">{name}</h4>
                                    )}

                                    {/* DIRECCIÓN (Editable si es nuevo) */}
                                    {isNewManualSpot ? (
                                        <div className="input-group input-group-sm mb-2">
                                            <span className="input-group-text bg-light border-0">📍</span>
                                            <input
                                                className="form-control form-control-sm border-bottom"
                                                placeholder="Dirección exacta..."
                                                value={address}
                                                onChange={e => setAddress(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-muted small">📍 {address}</p>
                                    )}

                                    {isNewManualSpot && (
                                        <div className="alert alert-warning py-1 small mb-0" style={{ fontSize: '0.75rem' }}>
                                            ⚠️ Punto manual detectado. Rellena los datos para guardar.
                                        </div>
                                    )}
                                </div>

                                {/* BLOQUE DE SEGURIDAD (Solo sitios existentes) */}
                                {!isNewManualSpot && (
                                    <div className={`alert ${comments.length < 3 ? 'alert-warning' : 'alert-info'} py-2 px-3 mb-3 border-0 shadow-sm`} style={{ fontSize: '0.85rem' }}>
                                        <div className="d-flex align-items-center mb-1">
                                            <span className="me-2">{comments.length < 3 ? '⚠️' : '🛡️'}</span>
                                            <strong className="text-uppercase" style={{ fontSize: '0.75rem' }}>
                                                {comments.length < 3 ? 'Lugar en verificación' : 'Punto verificado'}
                                            </strong>
                                        </div>
                                        <p className="mb-0 text-dark">
                                            Publicado por: <span className="fw-bold">{spot?.userName || "Usuario Veterano"}</span>
                                        </p>
                                    </div>
                                )}

                                <hr />

                                {/* SERVICIOS */}
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
                                                style={{ cursor: isNewManualSpot ? 'pointer' : 'default', transition: '0.2s' }}
                                            >
                                                {service.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* DESCRIPCIÓN */}
                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Descripción</h6>
                                {isNewManualSpot ? (
                                    <textarea
                                        className="form-control bg-light mb-4 p-3"
                                        rows="3"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Cuéntanos más sobre este sitio..."
                                    />
                                ) : (
                                    <div className="p-3 bg-light rounded mb-4" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', minHeight: '60px' }}>
                                        {description || "Sitio sin descripción disponible."}
                                    </div>
                                )}

                                {/* FORMULARIO DE RESEÑA */}
                                {!isNewManualSpot && (
                                    <div className="bg-light p-3 rounded border mb-4 shadow-sm">
                                        <h6 className="fw-bold small mb-3 text-uppercase">Tu Opinión</h6>
                                        <div className="d-flex gap-2">
                                            <select className="form-select form-select-sm w-25 border-0 shadow-sm" value={newRating} onChange={e => setNewRating(parseInt(e.target.value))}>
                                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                            </select>
                                            <textarea
                                                className="form-control form-control-sm border-0 shadow-sm"
                                                rows="1"
                                                style={{ resize: 'none', overflow: 'hidden' }}
                                                value={newComment}
                                                onChange={e => { setNewComment(e.target.value); autoGrow(e); }}
                                                placeholder="Escribe tu reseña..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* LISTA DE COMENTARIOS */}
                                {!isExternal && comments.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-3">Reseñas de la comunidad</h6>
                                        <div className="pe-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {comments.map(comment => (
                                                <div key={comment.coment_id} className="small bg-white p-3 rounded mb-2 border shadow-sm border-start border-success border-3">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <strong>{comment.user_name || `Usuario ${comment.user_id}`}</strong>
                                                        <span className="text-warning">{"★".repeat(comment.rating)}</span>
                                                    </div>
                                                    <div className="text-secondary">{comment.coment_text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* URL DE IMAGEN (Solo nuevo) */}
                                {isNewManualSpot && (
                                    <div className="mb-4">
                                        <label className="fw-bold small text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Link de la imagen</label>
                                        <input className="form-control form-control-sm border-0 bg-light" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                                    </div>
                                )}

                                {errorMessage && <div className="alert alert-danger py-2 small fw-bold text-center mb-3">{errorMessage}</div>}

                                <button className="btn btn-success w-100 fw-bold py-2 shadow-sm" onClick={handleAction}>
                                    {isNewManualSpot ? "🚀 PUBLICAR SITIO" : (isExternal ? "➕ GUARDAR SITIO" : "ENVIAR RESEÑA")}
                                </button>
                                
                                {!isNewManualSpot && !isExternal && (
                                    <button className="btn btn-outline-danger btn-sm w-100 mt-2 fw-bold" onClick={handleReport}>
                                        🚨 INFORMAR DE INSEGURIDAD
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};