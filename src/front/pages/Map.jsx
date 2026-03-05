import { useState, useEffect, useRef } from 'react';
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
  // --- REFERENCIAS (Para manipular el DOM y el mapa directamente) ---
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const searchRef = useRef(null);

  // --- ESTADOS ---
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchCategory, setSearchCategory] = useState(""); 
  const [searchResults, setSearchResults] = useState([]);
  const [mapBounds, setMapBounds] = useState(); // Coordenadas de lo que se ve en pantalla
  const [searchBounds, setSearchBounds] = useState(); // Coordenadas de la última búsqueda realizada
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false);
  const [stores, setStores] = useState([]); // Todos los spots de nuestra Base de Datos
  const [selectedStore, setSelectedStore] = useState(null); // Spot seleccionado en la Sidebar

  //  Estado para los filtros
  const [filters, setFilters] = useState({
    water: false,
    sleep: false,
    waste: false,
    electricity: false 
  });

  // 1. CARGA INICIAL: Traemos los datos de nuestra propia API
  useEffect(() => {
    const loadSpots = async () => {
      const data = await getAllSpots();
      if (data) setStores(data);
    };
    loadSpots();
  }, []);

  // 2. CONFIGURACIÓN DEL MAPA: Se ejecuta una sola vez al cargar la página

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
    if (mapRef.current) return; // Evita que el mapa se cree dos veces

    // Pequeño retardo para asegurar que el contenedor existe en el DOM
    const timer = setTimeout(() => {
      mapRef.current = new mapboxgl.Map({
        accessToken: MAPBOX_ACCESS_TOKEN,
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-3.70379, 40.41678], // Madrid por defecto
        zoom: 13,
        minZoom: 6
      });

      // Cuando el mapa termina de cargar sus estilos
      mapRef.current.on('load', () => {
        setMapBounds(mapRef.current.getBounds().toArray());
        setIsMapReady(true);
      });

      // Cada vez que el usuario deja de mover el mapa, actualizamos los límites (Bounds)
      mapRef.current.on('moveend', () => {
        setMapBounds(mapRef.current.getBounds().toArray());
      });

      // Inicializamos el motor de búsqueda de Mapbox
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


  // 3. NAVEGACIÓN: Mueve la cámara cuando seleccionamos un sitio en la Sidebar
  // EFECTO DE VUELO 
  useEffect(() => {
    if (selectedStore && mapRef.current) {
      // Intentamos sacar las coordenadas tanto si vienen de nuestra DB como de Mapbox
      const lng = selectedStore.longitude || selectedStore.geometry?.coordinates[0];
      const lat = selectedStore.latitude || selectedStore.geometry?.coordinates[1];
      
      if (lng && lat) {
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14, essential: true });
      }
    }
  }, [selectedStore]);

  // 4. LÓGICA DE BÚSQUEDA EN MAPBOX
  const performCategorySearch = async () => {
    if (!searchCategory || !mapBounds || !searchRef.current) return;

    // "water_waste" no existe en Mapbox, solo en nuestra DB. No hacemos petición a Mapbox.
    if (searchCategory === "water_waste") {
      setSearchResults([]);
      setShowSearchAreaButton(false);
      return;
    }

    // Convertimos los límites del mapa al formato que pide Mapbox [minLng, minLat, maxLng, maxLat]
    const flatBbox = [mapBounds[0][0], mapBounds[0][1], mapBounds[1][0], mapBounds[1][1]];

    try {
      const { features } = await searchRef.current.category(searchCategory, {
        bbox: flatBbox, 
        limit: 15
      });

      let cleanFeatures = features;

      // Filtro para eliminar campings que no son para autocaravanas (scouts, colegios, etc.)
      if (searchCategory === "campground") {
        const forbiddenWords = ["infantil", "scout", "niños", "youth", "school", "campamento"];
        cleanFeatures = features.filter(feature => {
          const name = (feature.properties.name || "").toLowerCase();
          return !forbiddenWords.some(word => name.includes(word));
        });
      }

      setSearchResults(cleanFeatures);
      setSearchBounds(mapBounds); // Guardamos dónde buscamos para saber si el usuario se mueve
      setShowSearchAreaButton(false);
    } catch (error) {
      console.error("Error Mapbox Search:", error);
      setSearchResults([]);
    }
  };

  // Ejecuta la búsqueda cada vez que el usuario pulsa un botón de categoría
  useEffect(() => { if (searchCategory) performCategorySearch(); }, [searchCategory]);

  // Muestra el botón "Buscar en esta área" si el usuario desplaza el mapa lejos de la última búsqueda
  useEffect(() => {
    if (searchCategory && searchBounds) {
      const boundsChanged = JSON.stringify(mapBounds) !== JSON.stringify(searchBounds);
      setShowSearchAreaButton(boundsChanged);
    }
  }, [mapBounds, searchCategory, searchBounds]);

  // --- 5. PREPARACIÓN DE DATOS PARA SIDEBAR Y MARCADORES ---

  // Filtramos los spots de NUESTRA Base de Datos según el botón pulsado
  const filteredDbStores = stores.filter(store => {
    if (!searchCategory) return store.category !== 'parking'; 
    if (searchCategory === "water_waste") return store.has_water || store.has_waste_dump;
    if (searchCategory === "parking") return store.is_sleepable || store.category === "parking";
    if (searchCategory === "campground") return store.category === "campground" || store.category === "area";
    return store.category === searchCategory;
  });

  // Unimos los resultados de la DB y de Mapbox en una sola lista para la Sidebar
  const unifiedListForSidebar = [
    ...filteredDbStores.map((s) => ({ 
      ...s, 
      id: `db-${s.spot_id}`, 
      isCustom: true 
    })),
    ...searchResults.map(f => ({ 
      ...f, 
      id: f.properties.mapbox_id || f.id, 
      name: f.properties.name, 
      address: f.properties.full_address || f.properties.address, 
      isCustom: false 
    }))
  ];

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
        stores={unifiedListForSidebar} 
        setSelectedStore={setSelectedStore} 
        selectedStore={selectedStore} 
      />

      <div style={{ flexGrow: 1, position: 'relative' }}>
        {/* Botonera de categorías */}
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

        {/* Botón flotante para re-buscar al mover el mapa */}
        {showSearchAreaButton && (
          <button onClick={performCategorySearch} className="search-area-button" style={{ zIndex: 101 }}>
            Buscar en esta área
          </button>
        )}

        {/* Marcadores de nuestra DB (Iconos Verdes) */}
        {isMapReady && filteredDbStores.map((store) => (
          <Marker key={`db-marker-${store.spot_id}`} map={mapRef.current} store={store} />
        ))}

        {/* Marcadores de Mapbox (Puntos Azules/POI) */}
        {isMapReady && searchResults.map((feature) => (
          <POIMarker 
            key={feature.properties.mapbox_id || feature.id} 
            map={mapRef.current} 
            feature={feature} 
            category={searchCategory} 
          />
        ))}

        {/* Contenedor físico del mapa */}
        <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      </div>
    </div>
  );
};