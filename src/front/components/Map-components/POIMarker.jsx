import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

/**
 * MarkerSVG: Componente interno que define la forma del pin.
 * Lo mantenemos aquí para que el archivo sea autónomo.
 */
const MarkerSVG = () => (
    <svg width="32" height="40" viewBox="0 0 88 106" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_2001_2)">
            <path d="M84.5254 40.7407C84.5254 63.2412 54.0169 100 43.8475 100C32.7535 100 3.16949 63.2412 3.16949 40.7407C3.16949 18.2403 21.3816 0 43.8475 0C66.3133 0 84.5254 18.2403 84.5254 40.7407Z" fill="#43538D" />
        </g>
        <circle cx="43.8983" cy="40.8983" r="33.8983" fill="#6B82D6" />
        <defs>
            <filter id="filter0_d_2001_2" x="0.169495" y="0" width="87.3559" height="106" filterUnits="userSpaceOnUse">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2001_2" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2001_2" result="shape" />
            </filter>
        </defs>
    </svg>
);

export const POIMarker = ({ map, feature, category }) => {
    const { geometry, properties } = feature;
    
    // Referencia para el objeto marcador de Mapbox
    const markerRef = useRef(null);

    const markerContentRef = useRef(document.createElement("div"));
    const popupContentRef = useRef(document.createElement("div"));

    useEffect(() => {
        // 1. Creamos el Popup (la ventanita que sale al hacer click)
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnMove: true,
            offset: 40,
        }).setDOMContent(popupContentRef.current);

        // 2. Creamos el Marcador físico en el mapa
        markerRef.current = new mapboxgl.Marker(markerContentRef.current, {
            anchor: "bottom",
        })
            .setLngLat(geometry.coordinates)
            .setPopup(popup)
            .addTo(map);

        return () => {
            if (markerRef.current) markerRef.current.remove();
        };
    }, [map, geometry.coordinates]);
    const getEmoji = (cat) => {
        const emojis = {
            "rv_park": "🚐",
            "campground": "⛺",
            "parking": "🅿️",
            "gas_station": "⛽",
            "supermarket": "🛒"
        };
        return emojis[cat] || "📍";
    };

    return (
        <>
            {/* Contenido del Popup */}
            {createPortal(
                <div style={{ padding: '5px' }}>
                    <div style={{ fontWeight: 'bold' }}>{properties.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {properties.full_address || properties.address}
                    </div>
                </div>,
                popupContentRef.current
            )}

            {/* Contenido del Marcador (el pin azul con emoji) */}
            {createPortal(
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <MarkerSVG />
                    <div style={{
                        position: 'absolute',
                        top: '6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '15px'
                    }}>
                        {getEmoji(category)}
                    </div>
                </div>,
                markerContentRef.current
            )}
        </>
    );
};