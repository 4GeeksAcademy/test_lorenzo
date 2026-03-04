import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

const MarkerSVG = () => (
    <svg width="32" height="40" viewBox="0 0 88 106" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative' }}>
        <g filter="url(#filter0_d_2001_2)">
            <path d="M84.5254 40.7407C84.5254 63.2412 54.0169 100 43.8475 100C32.7535 100 3.16949 63.2412 3.16949 40.7407C3.16949 18.2403 21.3816 0 43.8475 0C66.3133 0 84.5254 18.2403 84.5254 40.7407Z" fill="#002b24" />
        </g>
        <circle cx="43.8983" cy="40.8983" r="33.8983" fill="#00473C" />
        <defs>
            <filter id="filter0_d_2001_2" x="0.169495" y="0" width="87.3559" height="106" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="1.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            </filter>
        </defs>
    </svg>
);

export const Marker = ({ map, store }) => {
    const markerRef = useRef(null);
    const markerContentRef = useRef(document.createElement("div"));
    const popupContentRef = useRef(document.createElement("div"));

    useEffect(() => {
        if (!map || !store) return;
        const popup = new mapboxgl.Popup({
            closeButton: false, closeOnMove: true, offset: 40,
        }).setDOMContent(popupContentRef.current);

        markerRef.current = new mapboxgl.Marker(markerContentRef.current, { anchor: "bottom" })
            .setLngLat([store.longitude, store.latitude])
            .setPopup(popup)
            .addTo(map);

        return () => markerRef.current?.remove();
    }, [map, store]);

    let emoji = "📍";
    if (store.category === "campground" || store.category === "area") emoji = "🏕️";
    if (store.category === "parking" || store.is_sleepable) emoji = "🅿️";
    if (store.category === "water_waste" || store.has_water || store.has_waste_dump) emoji = "💧";

    return (
        <>
            {createPortal(
                <div style={{ padding: '5px' }}>
                    <div className="popup-title" style={{ fontWeight: 'bold' }}>{store.name}</div>
                    <div className="popup-address" style={{ fontSize: '12px', color: '#666' }}>{store.address}</div>
                </div>,
                popupContentRef.current
            )}
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