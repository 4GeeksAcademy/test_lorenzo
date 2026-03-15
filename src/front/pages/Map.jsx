import { useState, useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from '@mapbox/search-js-react';
import { SearchBoxCore } from '@mapbox/search-js-core';
import { Sidebar } from '../components/Map-components/Sidebar';
import { Marker } from '../components/Map-components/Marker';
import { getAllSpots } from '../services/spotServices';
import { SpotDetailModal } from '../components/Map-components/SpotDetailModal';

import '../../front/index.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = () => {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    water: false,
    sleep: false,
    waste: false,
    electricity: false,
    community: false
  });

  const loadSpots = async () => {
    const data = await getAllSpots();
    if (data) setStores(data);
  };

  useEffect(() => {
    loadSpots();
  }, []);

  const filteredStores = useMemo(() => {
    return (stores || []).filter(item => {
      const matchWater = !filters.water || item.has_water === true;
      const matchSleep = !filters.sleep || item.is_sleepable === true;
      const matchWaste = !filters.waste || item.has_waste_dump === true;
      const matchElectric = !filters.electricity || item.has_electricity === true;
      const matchCommunity = !filters.community || (item.user_id !== undefined);
      const matchesCategory = !searchCategory || item.category === searchCategory;

      return matchWater && matchSleep && matchWaste && matchElectric && matchCommunity && matchesCategory;
    });
  }, [stores, filters, searchCategory]);

  const unifiedListForSidebar = useMemo(() => {
    if (!mapBounds) return [];
    const [[swLng, swLat], [neLng, neLat]] = mapBounds;

    const visibleDbSpots = filteredStores.filter(spot => {
      return (
        spot.longitude >= swLng &&
        spot.longitude <= neLng &&
        spot.latitude >= swLat &&
        spot.latitude <= neLat
      );
    }).map(spot => ({
      ...spot,
      id: `db-${spot.spot_id}`,
      isCustom: true
    }));

    const mapboxSpots = filters.community ? [] : searchResults
      .filter(feature => {
        const yaExisteEnComunidad = visibleDbSpots.some(
          dbSpot => dbSpot.name.toLowerCase() === feature.properties.name.toLowerCase()
        );
        return !yaExisteEnComunidad;
      })
      .map((feature, index) => ({
        id: feature.id || `ext-${index}`,
        name: feature.properties.name,
        address: feature.properties.full_address || feature.properties.address,
        isCustom: false,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        category: searchCategory
      }));

    return [...visibleDbSpots, ...mapboxSpots].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [filteredStores, searchResults, mapBounds, filters.community, searchCategory]);

  // detecta si el ID es de un punto nuevo para usar selectedStore
  const selectedSpotData = useMemo(() => {
    if (!infoModalSpotId) return null;
    if (String(infoModalSpotId).startsWith('new-')) {
        return selectedStore;
    }
    return unifiedListForSidebar.find(s => s.id === infoModalSpotId);
  }, [infoModalSpotId, unifiedListForSidebar, selectedStore]);

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

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: true
      });
      mapRef.current.addControl(geolocate, 'top-right');
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      mapRef.current.on('load', () => {
        setIsMapReady(true);
        setMapBounds(mapRef.current.getBounds().toArray());
      });

      mapRef.current.on('moveend', () => {
        setMapBounds(mapRef.current.getBounds().toArray());
      });

      searchRef.current = new SearchBoxCore({ accessToken: MAPBOX_ACCESS_TOKEN, language: 'es' });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null; 
      }
    };
  }, []); 

  useEffect(() => {
    if (!mapRef.current) return;

    const handleMapClick = (e) => {
        const features = mapRef.current.queryRenderedFeatures(e.point);
        if (features.length > 0) {
            console.log("Clic sobre un elemento existente, cancelando creación.");
            return; 
        }

        const { lng, lat } = e.lngLat;
        const newId = `new-${Date.now()}`;
        
        const newSpotData = {
            id: newId,
            spot_id: newId,
            name: "", 
            address: "Punto seleccionado en el mapa",
            longitude: lng,
            latitude: lat,
            isCustom: false,
            category: searchCategory || "parking", 
            description: ""
        };

        setSelectedStore(newSpotData);
        setInfoModalSpotId(newId);
    };

    mapRef.current.on('click', handleMapClick);

    return () => {
        if (mapRef.current) mapRef.current.off('click', handleMapClick);
    };
}, [isMapReady, searchCategory]);

  useEffect(() => {
    if (selectedStore && mapRef.current) {
      const longitude = selectedStore.longitude || selectedStore.geometry?.coordinates[0];
      const latitude = selectedStore.latitude || selectedStore.geometry?.coordinates[1];
      if (longitude && latitude) {
        mapRef.current.flyTo({ center: [longitude, latitude], zoom: 14, essential: true });
      }
    }
  }, [selectedStore]);

  const performCategorySearch = async () => {
    if (!searchCategory || !mapBounds || !searchRef.current) return;
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

  useEffect(() => { if (searchCategory) performCategorySearch(); }, [searchCategory, filters.community]);

  useEffect(() => {
    if (searchCategory && searchBounds) {
      const boundsChanged = JSON.stringify(mapBounds) !== JSON.stringify(searchBounds);
      setShowSearchAreaButton(boundsChanged);
    }
  }, [mapBounds, searchCategory, searchBounds]);

  const categoryButtons = [
    { label: "🏕️ Áreas y Campings", value: "campground" },
    { label: "🅿️ Parking", value: "parking" },
    { label: "💧 Vaciado y agua", value: "water_waste" },
    { label: "⛽ Gasolineras", value: "gas_station" },
    { label: "🛒 Supermercados", value: "supermarket" }
  ];

  return (
    <div className="map-main-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar
          key={`sidebar-${unifiedListForSidebar.length}`}
          stores={unifiedListForSidebar}
          setSelectedStore={(store) => {
            setSelectedStore(store);
            setIsSidebarOpen(false);
          }}
          onOpenDetail={setInfoModalSpotId}
        />
      </div>

      <div className="map-wrapper" onClick={() => { if (isSidebarOpen) setIsSidebarOpen(false) }}>
        <div className="button-container">
          <button
            onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, community: !prev.community })); }}
            className={`category-button ${filters.community ? 'active community-active' : ''}`}
            style={{ backgroundColor: filters.community ? '#00473C' : '#fff', color: filters.community ? '#fff' : '#000', fontWeight: 'bold' }}
          >
            👥 Comunidad
          </button>
          <div className="separator"></div>
          {categoryButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={(e) => { e.stopPropagation(); setSearchCategory(value); }}
              className={`category-button ${searchCategory === value ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="search-center-container">
          <div className="search-box-wrapper">
            <SearchBox
              accessToken={MAPBOX_ACCESS_TOKEN}
              map={mapRef.current}
              mapboxgl={mapboxgl}
              placeholder="Busca una ciudad o dirección..."
              language="es"
              onRetrieve={(result) => {
                if (result && result.features.length > 0) {
                  const [longitude, latitude] = result.features[0].geometry.coordinates;
                  mapRef.current.flyTo({ center: [longitude, latitude], zoom: 14, essential: true });
                }
              }}
            />
          </div>
        </div>

        {showSearchAreaButton && (
          <button onClick={(e) => { e.stopPropagation(); performCategorySearch(); }} className="search-area-button">
            🔎 BUSCAR EN ESTA ZONA
          </button>
        )}

        <button className="mobile-list-toggle" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}>
          📋 Ver lista
        </button>

        <div ref={mapContainerRef} id="map-container" />

        {/* Marcadores DB */}
        {isMapReady && filteredStores.map((store) => (
          <Marker
            key={`db-${store.spot_id}`}
            map={mapRef.current}
            store={store}
            onOpenDetail={setInfoModalSpotId}
          />
        ))}

        {/* Marcadores Mapbox  */}
        {isMapReady && !filters.community && searchResults
          .filter(mapboxItem => !stores.some(dbSpot => dbSpot.name.toLowerCase() === mapboxItem.properties.name.toLowerCase()))
          .map((feature, index) => {
            const featureId = feature.id || `ext-${index}`;
            return (
              <Marker
                key={`ext-${featureId}`}
                map={mapRef.current}
                onOpenDetail={setInfoModalSpotId}
                store={{
                  spot_id: featureId,
                  id: featureId,
                  name: feature.properties.name,
                  address: feature.properties.full_address || feature.properties.address,
                  longitude: feature.geometry.coordinates[0],
                  latitude: feature.geometry.coordinates[1],
                  category: searchCategory,
                  rating: 0
                }}
              />
            );
          })}

        {infoModalSpotId && (
          <SpotDetailModal
            spotId={infoModalSpotId}
            externalData={selectedSpotData}
            onClose={() => setInfoModalSpotId(null)}
            onSuccess={loadSpots}
            allSpots={stores}
            onOpenDetail={setInfoModalSpotId}
          />
        )}
      </div>
    </div>
  );
};