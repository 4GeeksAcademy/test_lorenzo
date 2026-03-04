import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Marker } from '../components/Map-components/Marker';
import { Sidebar } from '../components/Map-components/Sidebar';
import { getAllSpots } from '../services/spotServices';

import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [stores, setStores] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  //  Estado para los filtros
  const [filters, setFilters] = useState({
    water: false,
    sleep: false,
    waste: false,
    electricity: false 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSpots();
        if (data && Array.isArray(data)) {
          setStores([...data]); 
        } else if (data && data.features) {
          setStores([...data.features]);
        }
      } catch (error) {
        console.error("Error cargando spots:", error);
      }
    };
    fetchData();
  }, []);

  // --- LÓGICA DE FILTRADO ---
  // Filtramos los stores antes de pasarlos al Sidebar y a los Markers
  const filteredStores = stores.filter(store => {
    // Si el filtro está en 'false', pasa todo. Si está en 'true', el store debe tener la propiedad en true.
    const matchWater = !filters.water || store.has_water;
    const matchSleep = !filters.sleep || store.is_sleepable;
    const matchWaste = !filters.waste || store.has_waste_dump;
    const matchElectric = !filters.electricity || store.has_electricity; 
    
    return matchWater && matchSleep && matchWaste && matchElectric;
  });

  // INICIALIZAR EL MAPA 
  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token || mapRef.current) return;
    mapboxgl.accessToken = token;

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-3.70379, 40.41678],
        zoom: 5,
        trackResize: true
      });

      mapRef.current.on('load', () => {
        setMapLoaded(true);
        setTimeout(() => { mapRef.current?.resize(); }, 300);
      });
    }

    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  // EFECTO DE VUELO 
  useEffect(() => {
    if (!selectedStore || !mapRef.current) return;
    const coords = selectedStore.geometry?.coordinates || [selectedStore.longitude, selectedStore.latitude];
    if (coords[0] && coords[1]) {
      mapRef.current.flyTo({ center: coords, zoom: 14, speed: 1.5, essential: true });
    }
  }, [selectedStore]);

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>

      {/* Pasamos filteredStores y las funciones de filtro al Sidebar */}
      <Sidebar
        stores={filteredStores} 
        filters={filters}
        setFilters={setFilters}
        setSelectedStore={setSelectedStore}
        selectedStore={selectedStore}
      />

      <div style={{ flexGrow: 1, position: 'relative', height: '100%' }}>
        <div
          ref={mapContainerRef}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#ccc' }}
        />

        {/* Los marcadores también se filtran automáticamente */}
        {mapLoaded && mapRef.current && filteredStores.map((location, index) => (
          <Marker
            key={location.spot_id || index}
            feature={location}
            map={mapRef.current}
            setSelectedStore={setSelectedStore}
            selectedStore={selectedStore}
          />
        ))}
      </div>
    </div>
  );
};