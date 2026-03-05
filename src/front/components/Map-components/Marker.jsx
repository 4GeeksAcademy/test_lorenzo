import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom"; // Importamos navegación
import mapboxgl from "mapbox-gl";

// --- COMPONENTE INTERNO DEL PIN ---
const MarkerSVG = () => (
    <svg width="32" height="40" viewBox="0 0 88 106" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_2001_2)">
            <path d="M84.5254 40.7407C84.5254 63.2412 54.0169 100 43.8475 100C32.7535 100 3.16949 63.2412 3.16949 40.7407C3.16949 18.2403 21.3816 0 43.8475 0C66.3133 0 84.5254 18.2403 84.5254 40.7407Z" fill="#002b24" />
        </g>
        <circle cx="43.8983" cy="40.8983" r="33.8983" fill="#00473C" />
        <defs>
            <filter id="filter0_d_2001_2" x="0.169495" y="0" width="87.3559" height="106" filterUnits="userSpaceOnUse">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            </filter>
        </defs>
    </svg>
);

// --- COMPONENTE PRINCIPAL ---
export const Marker = ({ map, store }) => {
    const navigate = useNavigate(); // Hook de navegación
    const markerRef = useRef(null);
    const markerContentRef = useRef(document.createElement("div"));
    const popupContentRef = useRef(document.createElement("div"));

    useEffect(() => {
        if (!map || !store) return;
        const popup = new mapboxgl.Popup({
            closeButton: true, // Activamos la X
            closeOnMove: false, // Mejor false para leer tranquilo
            offset: 40,
        }).setDOMContent(popupContentRef.current);

        markerRef.current = new mapboxgl.Marker(markerContentRef.current, { anchor: "bottom" })
            .setLngLat([store.longitude, store.latitude])
            .setPopup(popup)
            .addTo(map);

        return () => markerRef.current?.remove();
    }, [map, store]);

    // Lógica de Emojis
    let emoji = "📍";
    if (store.category === "campground" || store.category === "area") emoji = "🏕️";
    if (store.category === "parking" || store.is_sleepable) emoji = "🅿️";
    if (store.category === "water_waste" || store.has_water || store.has_waste_dump) emoji = "💧";

    // --- LÓGICA DE ESTRELLAS DINÁMICAS ---
    // Si no hay rating, mostramos un mensaje.
    // Si hay rating, lo redondeamos al entero más cercano para simplificar.
    const renderStars = (rating) => {
        if (!rating && rating !== 0) return <span style={{ color: '#888', fontSize: '11px' }}>Sin reseñas</span>;
        
        const roundedRating = Math.round(rating); // Redondeo (ej: 4.3 -> 4, 4.7 -> 5)
        const totalStars = 5;
        
        // Creamos una cadena de texto con las estrellas
        const filledStars = "★".repeat(roundedRating);
        const emptyStars = "☆".repeat(totalStars - roundedRating);
        
        return (
            <div style={{ color: '#FFB800', fontSize: '14px', marginBottom: '8px' }}>
                {filledStars}{emptyStars} 
                <span style={{ color: '#888', fontSize: '11px' }}> ({rating.toFixed(1)})</span> {/* Muestra el número real con un decimal */}
            </div>
        );
    };

    return (
        <>
            {/* 1. Contenido del Popup (creado por createPortal) */}
            {createPortal(
                <div style={{ padding: '10px', minWidth: '160px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>{store.name}</div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>{store.address || "Dirección no disponible"}</div>
                    
                    {/* Estrellas Dinámicas Reales del modelo */}
                    {renderStars(store.rating)}

                    <button 
                        // Navegación real al detalle del spot
                        onClick={() => navigate(`/spot/${store.spot_id}`)}
                        style={{
                            width: '100%',
                            backgroundColor: '#00473C', // Tu color corporativo
                            color: 'white',
                            border: 'none',
                            padding: '7px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Ver detalles
                    </button>
                </div>,
                popupContentRef.current
            )}

            {/* 2. Contenido del Marcador Físico (creado por createPortal) */}
            {createPortal(
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <MarkerSVG />
                    <div className="marker-emoji" style={{ position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', fontSize: '15px' }}>{emoji}</div>
                </div>,
                markerContentRef.current
            )}
        </>
    );
};