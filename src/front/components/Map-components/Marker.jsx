import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

const MarkerIcon = ({ color = "#00473C" }) => (
    <svg width="32" height="40" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">
        <path
            fill={color}
            d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"
        />
    </svg>
);

export const Marker = ({ map, store, onOpenDetail }) => {
    const markerRef = useRef(null);
    const markerElement = useRef(document.createElement("div"));
    const popupElement = useRef(document.createElement("div"));

    useEffect(() => {
    if (!map || !store) return;

    const el = markerElement.current;

    const popup = new mapboxgl.Popup({
        offset: 40,
        closeButton: true,
        closeOnClick: true,
    }).setDOMContent(popupElement.current);

    markerRef.current = new mapboxgl.Marker(el, { anchor: "bottom" })
        .setLngLat([store.longitude, store.latitude])
        .setPopup(popup)
        .addTo(map);

    if (String(store.spot_id).startsWith('new-')) {
        popup.addTo(map);
    }

    return () => {
        if (markerRef.current) {
            markerRef.current.remove();
        }
    };
}, [map, store]);

    let emoji = "📍";
    if (store.category === "campground") emoji = "🏕️";
    if (store.category === "parking") emoji = "🅿️";
    if (store.category === "water_waste") emoji = "💧";
    if (store.category === "gas_station") emoji = "⛽";
    if (store.category === "supermarket") emoji = "🛒";

    const renderStars = (rating) => {
        if (!rating && rating !== 0) return <span style={{ color: '#888', fontSize: '11px' }}>Sin reseñas</span>;
        const rounded = Math.round(rating);
        return (
            <div style={{ color: '#FFB800', fontSize: '14px', marginBottom: '8px' }}>
                {"★".repeat(rounded)}{"☆".repeat(5 - rounded)}
                <span style={{ color: '#888', fontSize: '11px' }}> ({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <>
            {createPortal(
                <div style={{ padding: '10px', minWidth: '160px', color: '#333' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{store.name}</div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                        {store.address || "Sin dirección"}
                    </div>

                    {renderStars(store.rating)}

                    {/* Añadimos la clase 'btn-ver-detalle' para que el listener nativo lo encuentre */}
                    <button
                        type="button"
                        onClick={(e) => {
                            // MUY IMPORTANTE: Estos dos bloquean al mapa pero activan la función
                            e.preventDefault();
                            e.stopPropagation();

                            const rawId = store.spot_id || store.id;
                            let finalId = String(rawId);
                            if (!finalId.includes('-')) finalId = `db-${finalId}`;

                            console.log("Ejecutando onOpenDetail para:", finalId);
                            onOpenDetail(finalId);
                        }}
                        style={{
                            width: '100%',
                            backgroundColor: '#00473C',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            marginTop: '8px'
                        }}
                    >
                        Ver detalles
                    </button>
                </div>,
                popupElement.current
            )}

            {createPortal(
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <MarkerIcon />
                    <div style={{
                        position: 'absolute',
                        top: '6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '15px',
                        pointerEvents: 'none'
                    }}>
                        {emoji}
                    </div>
                </div>,
                markerElement.current
            )}
        </>
    );
};