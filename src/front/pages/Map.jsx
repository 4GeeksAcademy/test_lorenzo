import { useState, useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchBoxCore } from '@mapbox/search-js-core';
import { Sidebar } from '../components/Map-components/Sidebar';
import { POIMarker } from '../components/Map-components/POIMarker';
import { Marker } from '../components/Map-components/Marker';
import { getAllSpots } from '../services/spotServices';
import '../../front/index.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = () => {
  // --- REFERENCIAS ---
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const searchRef = useRef(null);

  // --- ESTADOS ---
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapBounds, setMapBounds] = useState();
  const [searchBounds, setSearchBounds] = useState();
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  // Estado para los filtros coordinados con el equipo
  const [filters, setFilters] = useState({
    water: false,
    sleep: false,
    waste: false,
    electricity: false
  });

  // 1. CARGA INICIAL: Sincronización con la Base de Datos
  useEffect(() => {
    const loadSpots = async () => {
      const data = await getAllSpots();
      if (data) setStores(data);
    };
    loadSpots();
  }, []);

  // --- LÓGICA DE FILTRADO UNIFICADA ---
  const filteredStores = useMemo(() => {
    return (stores || []).filter(store => {
      // Filtros de servicios
      const matchWater = !filters.water || store.has_water === true;
      const matchSleep = !filters.sleep || store.is_sleepable === true;
      const matchWaste = !filters.waste || store.has_waste_dump === true;
      const matchElectric = !filters.electricity || store.has_electricity === true;

      // Filtro de categoría (mantiene todos visibles si no hay selección)
      const matchesCategory = !searchCategory ||
        (searchCategory === "water_waste" && (store.has_water || store.has_waste_dump)) ||
        (searchCategory === "parking" && (store.is_sleepable || store.category === "parking")) ||
        (searchCategory === "campground" && (store.category === "campground" || store.category === "area")) ||
        (store.category === searchCategory);

      return matchWater && matchSleep && matchWaste && matchElectric && matchesCategory;
    });
  }, [stores, filters, searchCategory]);

  // 2. INICIALIZAR EL MAPA
  useEffect(() => {
    if (mapRef.current) return;

    const timer = setTimeout(() => {
      mapRef.current = new mapboxgl.Map({
        accessToken: MAPBOX_ACCESS_TOKEN,
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-3.70379, 40.41678], // Madrid
        zoom: 13,
        minZoom: 6
      });

      mapRef.current.on('load', () => {
        setMapBounds(mapRef.current.getBounds().toArray());
        setIsMapReady(true);
      });

      mapRef.current.on('moveend', () => {
        setMapBounds(mapRef.current.getBounds().toArray());
      });

      searchRef.current = new SearchBoxCore({
        accessToken: MAPBOX_ACCESS_TOKEN,
        language: 'es'
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // 3. NAVEGACIÓN Y VUELO
  useEffect(() => {
    if (selectedStore && mapRef.current) {
      const lng = selectedStore.longitude || selectedStore.geometry?.coordinates[0];
      const lat = selectedStore.latitude || selectedStore.geometry?.coordinates[1];
      if (lng && lat) {
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14, essential: true });
      }
    }
  }, [selectedStore]);

  // 4. LÓGICA DE BÚSQUEDA EXTERNA (MAPBOX)
  const performCategorySearch = async () => {
    if (!searchCategory || !mapBounds || !searchRef.current) return;
    if (searchCategory === "water_waste") {
      setSearchResults([]);
      setShowSearchAreaButton(false);
      return;
    }

    const flatBbox = [mapBounds[0][0], mapBounds[0][1], mapBounds[1][0], mapBounds[1][1]];

    try {
      const { features } = await searchRef.current.category(searchCategory, {
        bbox: flatBbox,
        limit: 15
      });
      
      let cleanFeatures = features;
      if (searchCategory === "campground") {
        const forbiddenWords = ["infantil", "scout", "niños", "youth", "school", "campamento"];
        cleanFeatures = features.filter(feature => {
          const name = (feature.properties.name || "").toLowerCase();
          return !forbiddenWords.some(word => name.includes(word));
        });
      }
      setSearchResults(cleanFeatures);
      setSearchBounds(mapBounds);
      setShowSearchAreaButton(false);
    } catch (error) {
      setSearchResults([]);
    }
  };

  useEffect(() => { if (searchCategory) performCategorySearch(); }, [searchCategory]);

  useEffect(() => {
    if (searchCategory && searchBounds) {
      const boundsChanged = JSON.stringify(mapBounds) !== JSON.stringify(searchBounds);
      setShowSearchAreaButton(boundsChanged);
    }
  }, [mapBounds, searchCategory, searchBounds]);

  // --- 5. UNIFICACIÓN DE DATOS (SIDEBAR) ---
  const unifiedListForSidebar = useMemo(() => {
    if (!mapBounds) return [];

    // Extraemos los límites actuales del mapa
    const [[swLng, swLat], [neLng, neLat]] = mapBounds;

    // 1. Filtramos los puntos de nuestra DB para que SOLO aparezcan los que se ven en el mapa
    const visibleDbSpots = filteredStores.filter(s => {
      return s.longitude >= swLng && s.longitude <= neLng &&
             s.latitude >= swLat && s.latitude <= neLat;
    }).map(s => ({ ...s, id: `db-${s.spot_id}`, isCustom: true }));

    // 2. Los resultados de Mapbox ya vienen filtrados por área desde la API
    const mapboxSpots = searchResults.map(f => ({
      ...f,
      id: f.properties.mapbox_id || f.id,
      name: f.properties.name,
      address: f.properties.full_address || f.properties.address,
      isCustom: false
    }));

    // 3. Unimos ambos y ORDENAMOS por estrellas
    return [...visibleDbSpots, ...mapboxSpots].sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingB - ratingA;
    });
  }, [filteredStores, searchResults, mapBounds]);

  const categoryButtons = [
    { label: "🏕️ Áreas y Campings", value: "campground" },
    { label: "🅿️ Parkings (Pernocta)", value: "parking" },
    { label: "💧 Vaciado y Agua", value: "water_waste" },
    { label: "⛽ Gasolineras", value: "gas_station" },
    { label: "🛒 Supermercados", value: "supermarket" }
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 65px)', position: 'relative' }}>
      <Sidebar
        key={`sidebar-refresh-${unifiedListForSidebar.length}`}
        stores={unifiedListForSidebar}
        setSelectedStore={setSelectedStore}
        selectedStore={selectedStore}
      />

      <div style={{ flexGrow: 1, position: 'relative' }}>
        <div className="button-container" style={{ zIndex: 100 }}>
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
          <button onClick={performCategorySearch} className="search-area-button" style={{ zIndex: 101 }}>
            Buscar en esta área
          </button>
        )}

        {/* Marcadores de la Comunidad (Verdes) */}
        {isMapReady && filteredStores.map((store) => (
          <Marker
            key={`marker-${store.spot_id}-${filters.water}-${filters.waste}-${searchCategory}`}
            map={mapRef.current}
            store={store}
          />
        ))}

        {/* Marcadores Externos (Azules) */}
        {isMapReady && searchResults.map((feature) => (
          <POIMarker
            key={feature.properties.mapbox_id || feature.id}
            map={mapRef.current}
            feature={feature}
            category={searchCategory}
          />
        ))}

        <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      </div>
    </div>
  );
};