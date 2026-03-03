import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from 'mapbox-gl';

export const Marker = ({ map, feature, selectedStore, setSelectedStore }) => {
    // 1. Extraemos los datos con seguridad (Base de datos vs GeoJSON)
    const name = feature?.properties?.name || feature?.name || "Sin nombre";
    const address = feature?.properties?.address || feature?.address || "";
    
    // 2. Extraemos coordenadas con seguridad
    // Mapbox necesita [longitud, latitud]
    const coords = feature?.geometry?.coordinates || [feature?.longitude, feature?.latitude];

    const contentRef = useRef(document.createElement("div"));
    const markerRef = useRef(null);
    const popupRef = useRef(null);
    
    // 3. Comprobamos si es el seleccionado (comparando nombres o IDs)
    const selectedName = selectedStore?.properties?.name || selectedStore?.name;
    const isSelected = name === selectedName;
    
    useEffect(() => {
        // Solo creamos el marcador si tenemos coordenadas válidas
        if (!coords[0] || !coords[1]) return;

        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat(coords)
            .addTo(map);

        return () => {
             markerRef.current?.remove();
             popupRef.current?.remove();
        };
    }, [map, coords]);

    // Manejo del Popup
    useEffect(() => {
        if (isSelected && map && coords[0]) {
            popupRef.current = new mapboxgl.Popup({ offset: 30, closeButton: false })
                .setLngLat(coords)
                .setHTML(`
                    <div style="padding: 5px; color: #00473C; font-family: sans-serif;">
                        <h4 style="margin: 0; font-size: 14px; font-weight: bold;">${name}</h4>
                        <p style="margin: 0; font-size: 12px; color: #666;">${address}</p>
                    </div>
                `)
                .addTo(map);
        } else {
            popupRef.current?.remove();
        }
    }, [isSelected, map, coords, name, address]);

    const iconBase = '/iconos%20mapa/sg-marker.svg';
    const iconSelected = '/iconos%20mapa/sg-marker-selected.svg';

    return (
         <>
            {createPortal(
                <div 
                    onClick={() => setSelectedStore(feature)}
                    style={{
                        backgroundImage: `url("${isSelected ? iconSelected : iconBase}")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        cursor: 'pointer',
                        width: isSelected ? '42px' : '37px',
                        height: isSelected ? '45px' : '40px',
                        transition: 'all 0.3s ease',
                        zIndex: isSelected ? 10 : 1
                    }}
                    title={name}
                >
                </div>,
                contentRef.current
            )}
        </>
    );
};