import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ stores, selectedStore, setSelectedStore, onOpenDetail }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    const icons = {
      campground: '🏕️',
      parking: '🅿️',
      water_waste: '💧',
      gas_station: '⛽',
      supermarket: '🛒'
    };
    return icons[category?.toLowerCase()] || '📍';
  };

  return (
    <aside className="sidebar-container" style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        padding: '15px',
        backgroundColor: '#00473C',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
          🚐 Lugares encontrados ({stores.length})
        </h2>
      </header>

      <div style={{ padding: '12px' }}>
        {stores.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
            <span style={{ fontSize: '2rem' }}>🔍</span>
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>No hay lugares en esta zona.<br/>Mueve el mapa para buscar.</p>
          </div>
        ) : (
          stores.map((store) => {
            const isSelected = selectedStore?.id === store.id;
            
            // Definimos si es comunidad dentro del map
            const isFromCommunity = store.isCustom || (typeof store.id === 'string' && store.id.startsWith('db-'));

            return (
              <article
                key={store.id} 
                onClick={() => setSelectedStore(store)}
                style={{
                  padding: '12px',
                  marginBottom: '10px',
                  backgroundColor: isSelected ? '#e6f2f0' : '#ffffff',
                  border: isSelected ? '2px solid #00473C' : '1px solid #eee',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>
                    {getCategoryIcon(store.category)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0', fontSize: '0.95rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                      {store.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                      {isFromCommunity ? (
                        <>
                          <span style={{ color: '#FFB800', fontSize: '0.8rem' }}>
                            {"★".repeat(Math.round(store.rating || 0)) + "☆".repeat(5 - Math.round(store.rating || 0))}
                          </span>
                          <span style={{ color: '#0f5132', fontSize: '0.7rem', fontWeight: 'bold', backgroundColor: '#d1e7dd', padding: '1px 5px', borderRadius: '3px' }}>
                            COMUNIDAD
                          </span>
                        </>
                      ) : (
                        <span style={{ color: '#6c757d', fontSize: '0.7rem', fontStyle: 'italic' }}>
                          📍 Sugerencia de Mapbox
                        </span>
                      )}
                    </div>
                    
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#666', lineHeight: '1.2' }}>
                      {store.address || "Sin dirección conocida"}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Enviamos el store.id completo para que el modal no se pierda
                      onOpenDetail(store.id);
                    }}
                    style={{ 
                      padding: '5px 12px', 
                      backgroundColor: isFromCommunity ? '#00473C' : '#6c757d', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      cursor: 'pointer' 
                    }}
                  >
                    {isFromCommunity ? "Ver detalles" : "Ver / Añadir"}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </aside>
  );
};