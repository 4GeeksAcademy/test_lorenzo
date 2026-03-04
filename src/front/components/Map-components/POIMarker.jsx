import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

const MarkerSVG = () => (
    <svg width="32" height="40" viewBox="0 0 88 106" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_2001_2)">
            <path d="M84.5254 40.7407C84.5254 63.2412 54.0169 100 43.8475 100C32.7535 100 3.16949 63.2412 3.16949 40.7407C3.16949 18.2403 21.3816 0 43.8475 0C66.3133 0 84.5254 18.2403 84.5254 40.7407Z" fill="#43538D" />
        </g>
        <circle cx="43.8983" cy="40.8983" r="33.8983" fill="#6B82D6" />
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

export const POIMarker = ({ map, feature, category }) => {
    const { geometry, properties } = feature;
    const markerRef = useRef(null);
    const markerContentRef = useRef(document.createElement("div"));
    const popupContentRef = useRef(document.createElement("div"));

    useEffect(() => {
        if (!map) return;
        const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnMove: false,
            offset: 40,
        }).setDOMContent(popupContentRef.current);

        markerRef.current = new mapboxgl.Marker(markerContentRef.current, { anchor: "bottom" })
            .setLngLat(geometry.coordinates)
            .setPopup(popup)
            .addTo(map);

        return () => markerRef.current?.remove();
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
            {createPortal(
                <div style={{ padding: '10px', minWidth: '160px', color: '#333' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{properties.name}</div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                        {properties.full_address || properties.address || "Dirección de Mapbox"}
                    </div>
                    
                    <div style={{ 
                        display: 'inline-block', padding: '2px 6px', backgroundColor: '#f0f0f0', 
                        borderRadius: '4px', fontSize: '10px', textTransform: 'uppercase', 
                        marginBottom: '10px', color: '#555' 
                    }}>
                        {category?.replace('_', ' ') || 'Sugerencia'}
                    </div>

                    <button 
                        onClick={() => alert(`Información externa de Mapbox para: ${properties.name}`)}
                        style={{
                            width: '100%', backgroundColor: '#43538D', color: 'white',
                            border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                        }}
                    >
                        Ver en buscador
                    </button>
                </div>,
                popupContentRef.current
            )}
            {createPortal(
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <MarkerSVG />
                    <div style={{ position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', fontSize: '15px' }}>
                        {getEmoji(category)}
                    </div>
                </div>,
                markerContentRef.current
            )}
        </>
    );
};