import React, { useState, useEffect } from 'react';
import { getSpotById, createSpot, getAllComments, createComment } from '../../services/spotServices';

export const SpotDetailModal = ({ spotId, onClose }) => {
    const [spot, setSpot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    
    // Estados del formulario 
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("parkings");

    // Estados de servicios (Agua, Vaciado, Luz, Pernocta)
    const [hasWater, setHasWater] = useState(false);
    const [hasWaste, setHasWaste] = useState(false);
    const [hasLight, setHasLight] = useState(false);
    const [isSleepable, setIsSleepable] = useState(false);

    // Estados de reseña
    const [newComment, setNewComment] = useState(""); 
    const [newRating, setNewRating] = useState(5);

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
                setComments(allComments.filter(c => c.spot_id === parseInt(cleanId)));
                
                setName(spotData?.name || "");
                setAddress(spotData?.address || "");
                setDescription(spotData?.description || "");
                setCategory(spotData?.category || "parkings");
                setHasWater(spotData?.has_water || false);
                setHasWaste(spotData?.has_waste_dump || false);
                setHasLight(spotData?.has_electricity || false);
                setIsSleepable(spotData?.is_sleepable || false);
            } else {
                setName("Nombre del sitio");
                setAddress("Dirección por confirmar");
                setCategory("parkings");
            }
            setLoading(false);
        };
        loadDetail();
    }, [spotId, isExternal]);

    const handleAction = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Debes iniciar sesión");

        const cleanId = String(spotId).replace('db-', '');
        const data = {
            name, address, description, 
            image_url: imageUrl, 
            rating: newRating, 
            comment: newComment,
            category: category,
            has_water: hasWater,
            has_waste_dump: hasWaste,
            has_electricity: hasLight,
            is_sleepable: isSleepable,
            latitude: spot?.latitude || 40.4167,
            longitude: spot?.longitude || -3.7037
        };

        if (isExternal) {
            const result = await createSpot(data);
            if (result) alert("¡Lugar añadido!");
        } else {
            const success = await createComment(cleanId, newComment, newRating);
            if (success) alert("¡Comentario publicado!");
        }
        window.location.reload();
        onClose();
    };

    if (!spotId) return null;

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
                                    <img 
                                        src={spot?.media?.[0]?.url || imageUrl} 
                                        className="img-fluid w-100" 
                                        style={{ height: '300px', objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} 
                                    />
                                ) : (
                                    <div className="bg-light d-flex flex-column align-items-center justify-content-center" style={{ height: '200px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                                        <span style={{ fontSize: '3rem' }}>{isExternal ? '📍' : '📷'}</span>
                                    </div>
                                )}
                                <button className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 rounded-circle shadow-sm" onClick={onClose}></button>
                            </div>

                            <div className="modal-body p-4">
                                {/* CATEGORÍA Y TÍTULOS */}
                                <div className="mb-3">
                                    <select 
                                        className="form-select form-select-sm border-0 bg-success bg-opacity-10 text-success fw-bold w-auto mb-2" 
                                        value={category} 
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option value="areas y campings">🏕️ Áreas y Campings</option>
                                        <option value="parkings">🅿️ Parkings</option>
                                        <option value="vaciado y agua">💧 Vaciado y Agua</option>
                                        <option value="gasolineras">⛽ Gasolineras</option>
                                        <option value="supermercados">🛒 Supermercados</option>
                                    </select>
                                    <input className="form-control fw-bold h4 border-0 p-0 shadow-none mb-1" value={name} onChange={e => setName(e.target.value)} />
                                    <p className="text-muted small mb-3">📍 {address}</p>
                                </div>

                                <hr />

                                {/* SERVICIOS (ESTILO ICONOS QUE TE GUSTABA) */}
                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Servicios</h6>
                                <div className="row g-2 text-center mb-4">
                                    <div className="col-3">
                                        <div 
                                            onClick={() => setHasWater(!hasWater)}
                                            className={`p-2 rounded small cursor-pointer ${hasWater ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted border'}`}
                                            style={{ cursor: 'pointer' }}
                                        >💧 Agua</div>
                                    </div>
                                    <div className="col-3">
                                        <div 
                                            onClick={() => setHasWaste(!hasWaste)}
                                            className={`p-2 rounded small cursor-pointer ${hasWaste ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted'}`}
                                            style={{ cursor: 'pointer' }}
                                        >🗑️ Vaciado</div>
                                    </div>
                                    <div className="col-3">
                                        <div 
                                            onClick={() => setHasLight(!hasLight)}
                                            className={`p-2 rounded small cursor-pointer ${hasLight ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted'}`}
                                            style={{ cursor: 'pointer' }}
                                        >⚡ Luz</div>
                                    </div>
                                    <div className="col-3">
                                        <div 
                                            onClick={() => setIsSleepable(!isSleepable)}
                                            className={`p-2 rounded small cursor-pointer ${isSleepable ? 'bg-success bg-opacity-10 text-success fw-bold border border-success' : 'bg-light text-muted'}`}
                                            style={{ cursor: 'pointer' }}
                                        >🚐 Pernocta</div>
                                    </div>
                                </div>

                                <h6 className="fw-bold small text-muted text-uppercase mb-2">Descripción</h6>
                                <textarea className="form-control border-0 bg-light mb-4" rows="1" style={{ resize: 'none', overflow: 'hidden' }} value={description} onChange={e => { setDescription(e.target.value); autoGrow(e); }} placeholder="Información útil..." />

                                {/* VALORACIÓN Y COMENTARIO */}
                                <div className="bg-light p-3 rounded border mb-4 shadow-sm">
                                    <h6 className="fw-bold small mb-3 text-uppercase">Tu Opinión</h6>
                                    <div className="d-flex gap-2">
                                        <select className="form-select form-select-sm w-25 border-0 shadow-sm" value={newRating} onChange={e => setNewRating(parseInt(e.target.value))}>
                                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                        </select>
                                        <textarea className="form-control form-control-sm border-0 shadow-sm" rows="1" style={{ resize: 'none', overflow: 'hidden' }} value={newComment} onChange={e => { setNewComment(e.target.value); autoGrow(e); }} placeholder="¿Qué tal el sitio?..." />
                                    </div>
                                </div>

                                {/* LISTA DE COMENTARIOS (Solo si existen) */}
                                {!isExternal && comments.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold small text-muted text-uppercase mb-3">Reseñas</h6>
                                        <div className="pe-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {comments.map(c => (
                                                <div key={c.coment_id} className="small bg-white p-2 rounded mb-2 border shadow-sm border-start border-success border-3">
                                                    <strong>Usuario {c.user_id}</strong> ({c.rating}★) - {c.coment_text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <label className="fw-bold small text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>URL Imagen</label>
                                <input className="form-control form-control-sm border-0 bg-light mb-4" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />

                                <button className="btn btn-success w-100 fw-bold py-2 shadow-sm" onClick={handleAction}>
                                    {isExternal ? "➕ GUARDAR EN LA COMUNIDAD" : "💾 ACTUALIZAR DATOS / COMENTAR"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};