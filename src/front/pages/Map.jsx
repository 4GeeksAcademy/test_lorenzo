import { useState, useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchBoxCore } from '@mapbox/search-js-core';
import { Sidebar } from '../components/Map-components/Sidebar';
import { Marker } from '../components/Map-components/Marker';
import { getAllSpots } from '../services/spotServices';
import { SpotDetailModal } from '../components/Map-components/SpotDetailModal';

import '../../front/index.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = () => {
  // # FASE 1: REFERENCIAS Y ESTADOS
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const searchRef = useRef(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapBounds, setMapBounds] = useState();
  const [searchBounds, setSearchBounds] = useState();
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [infoModalSpotId, setInfoModalSpotId] = useState(null);

  // # FASE #1 filtros de servicios
  const [filters, setFilters] = useState({
    water: false, 
    sleep: false, 
    waste: false, 
    electricity: false, 
    community: false 
  });

  // # FASE 2: CARGA DE DATOS (NUESTRA API)
  useEffect(() => {
    const loadSpots = async () => {
      const data = await getAllSpots();
      if (data) setStores(data);
    };
    loadSpots();
  }, []);

  // # FASE 3: LÓGICA DE FILTRADO (NUESTROS SPOTS)
  const filteredStores = useMemo(() => {
    return (stores || []).filter(store => {
      const matchWater = !filters.water || store.has_water === true;
      const matchSleep = !filters.sleep || store.is_sleepable === true;
      const matchWaste = !filters.waste || store.has_waste_dump === true;
      const matchElectric = !filters.electricity || store.has_electricity === true;

      const matchesCategory = !searchCategory ||
        (searchCategory === "water_waste" && (store.has_water || store.has_waste_dump)) ||
        (searchCategory === "parking" && (store.is_sleepable || store.category === "parking")) ||
        (searchCategory === "campground" && (store.category === "campground" || store.category === "area")) ||
        (store.category === searchCategory);

      return matchWater && matchSleep && matchWaste && matchElectric && matchesCategory;
    });
  }, [stores, filters, searchCategory]);

  // # FASE 4: INICIALIZAR MAPBOX
  useEffect(() => {
    if (mapRef.current) return;

    const timer = setTimeout(() => {
      mapRef.current = new mapboxgl.Map({
        accessToken: MAPBOX_ACCESS_TOKEN,
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-3.70379, 40.41678], 
        zoom: 13
      });

      mapRef.current.on('load', () => {
        setMapBounds(mapRef.current.getBounds().toArray());
        setIsMapReady(true);
      });

      mapRef.current.on('moveend', () => {
        setMapBounds(mapRef.current.getBounds().toArray());
      });

      searchRef.current = new SearchBoxCore({ accessToken: MAPBOX_ACCESS_TOKEN, language: 'es' });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // # FASE 5: NAVEGACIÓN
  useEffect(() => {
    if (selectedStore && mapRef.current) {
      const lng = selectedStore.longitude || selectedStore.geometry?.coordinates[0];
      const lat = selectedStore.latitude || selectedStore.geometry?.coordinates[1];
      if (lng && lat) {
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14, essential: true });
      }
    }
  }, [selectedStore]);

  // # FASE 6: BÚSQUEDA MAPBOX (EXTERNA)
  const performCategorySearch = async () => {
    if (!searchCategory || !mapBounds || !searchRef.current) return;
    
    // # Si el filtro de comunidad está activo, NO buscamos fuera
    if (searchCategory === "water_waste" || filters.community) {
      setSearchResults([]);
      setShowSearchAreaButton(false);
      return;
    }

    const flatBbox = [mapBounds[0][0], mapBounds[0][1], mapBounds[1][0], mapBounds[1][1]];

    try {
      const { features } = await searchRef.current.category(searchCategory, { bbox: flatBbox, limit: 15 });
      setSearchResults(features);
      setSearchBounds(mapBounds);
      setShowSearchAreaButton(false);
    } catch (error) {
      setSearchResults([]);
    }
  };

  // # Re-buscamos si cambia la categoría O si activamos/desactivamos comunidad
  useEffect(() => { if (searchCategory) performCategorySearch(); }, [searchCategory, filters.community]);

  // # FASE 7: BOTÓN "BUSCAR EN ESTA ÁREA"
  useEffect(() => {
    if (searchCategory && searchBounds) {
      const boundsChanged = JSON.stringify(mapBounds) !== JSON.stringify(searchBounds);
      setShowSearchAreaButton(boundsChanged);
    }
  }, [mapBounds, searchCategory, searchBounds]);

  // # FASE 8: UNIFICACIÓN SIDEBAR (Teniendo en cuenta el filtro de comunidad)
  const unifiedListForSidebar = useMemo(() => {
    if (!mapBounds) return [];
    const [[swLng, swLat], [neLng, neLat]] = mapBounds;

    const visibleDbSpots = filteredStores.filter(s => {
      return s.longitude >= swLng && s.longitude <= neLng && s.latitude >= swLat && s.latitude <= neLat;
    }).map(s => ({ ...s, id: `db-${s.spot_id}`, isCustom: true }));

    // # Si el filtro 'community' es true, la lista de Mapbox será vacía
    const mapboxSpots = filters.community ? [] : searchResults.map(f => ({
      id: f.id,
      name: f.properties.name,
      address: f.properties.full_address || f.properties.address,
      isCustom: false,
      longitude: f.geometry.coordinates[0],
      latitude: f.geometry.coordinates[1],
      category: searchCategory
    }));

    return [...visibleDbSpots, ...mapboxSpots].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [filteredStores, searchResults, mapBounds, filters.community]);

  const categoryButtons = [
    { label: "🏕️ Áreas", value: "campground" },
    { label: "🅿️ Parking", value: "parking" },
    { label: "💧 Vaciado", value: "water_waste" },
    { label: "⛽ Gasolineras", value: "gas_station" },
    { label: "🛒 Súper", value: "supermarket" }
  ];

  // # FASE 9: RENDERIZADO
  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 65px)', position: 'relative' }}>
      <Sidebar
        key={`sidebar-${unifiedListForSidebar.length}`}
        stores={unifiedListForSidebar}
        setSelectedStore={setSelectedStore}
        onOpenDetail={setInfoModalSpotId}
      />

      <div style={{ flexGrow: 1, position: 'relative' }}>
        <div className="button-container" style={{ zIndex: 100 }}>
          {/* # BOTÓN ESPECIAL: FILTRO DE COMUNIDAD */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, community: !prev.community }))}
            className={`category-button ${filters.community ? 'active' : ''}`}
            style={{ backgroundColor: filters.community ? '#00473C' : '#fff', color: filters.community ? '#fff' : '#000', fontWeight: 'bold' }}
          >
            👥 Solo Comunidad
          </button>
          
          <div style={{ borderLeft: '1px solid #ccc', height: '25px', margin: '0 10px' }}></div>

          {categoryButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSearchCategory(value)}
              className={`category-button ${searchCategory === value ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {showSearchAreaButton && (
          <button onClick={performCategorySearch} className="search-area-button">
            Buscar en esta área
          </button>
        )}

        {/* 1. Nuestros marcadores (Siempre visibles según sus filtros) */}
        {isMapReady && filteredStores.map((store) => (
          <Marker
            key={`db-${store.spot_id}`}
            map={mapRef.current}
            store={store}
            onOpenDetail={setInfoModalSpotId}
          />
        ))}

        {/* 2. Marcadores Mapbox: SOLO si el filtro de comunidad está apagado */}
        {isMapReady && !filters.community && searchResults.map((feature) => (
          <Marker
            key={`ext-${feature.id}`}
            map={mapRef.current}
            onOpenDetail={setInfoModalSpotId}
            store={{
              spot_id: feature.id,
              name: feature.properties.name,
              address: feature.properties.full_address || feature.properties.address,
              longitude: feature.geometry.coordinates[0],
              latitude: feature.geometry.coordinates[1],
              category: searchCategory,
              rating: 0
            }}
          />
        ))}

        {infoModalSpotId && (
          <SpotDetailModal spotId={infoModalSpotId} onClose={() => setInfoModalSpotId(null)} />
        )}

        <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      </div>
    </div>
  );
};