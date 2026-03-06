import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ stores, selectedStore, setSelectedStore, onOpenDetail }) => {
  const navigate = useNavigate();

  // # Función para poner el emoji correcto en la lista
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
    <aside style={{
      width: '320px',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Cabecera de la lista */}
      <header style={{
        padding: '12px 15px',
        backgroundColor: '#00473C',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
          📍 Lugares ({stores.length})
        </h2>
      </header>

      <div style={{ padding: '10px' }}>
        {stores.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            <p style={{ fontSize: '0.9rem' }}>Busca en el mapa...</p>
          </div>
        ) : (
          stores.map((store) => {
            const isSelected = selectedStore?.id === store.id;

            return (
              <article
                key={store.id}
                onClick={() => setSelectedStore(store)}
                style={{
                  padding: '10px 12px',
                  marginBottom: '8px',
                  backgroundColor: isSelected ? '#e6f2f0' : '#ffffff',
                  border: isSelected ? '1px solid #00473C' : '1px solid #eee',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {getCategoryIcon(store.category)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0', fontSize: '0.95rem', color: '#2c3e50' }}>
                      {store.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                      {store.isCustom ? (
                        store.rating ? (
                          <>
                            <span style={{ color: '#FFB800', fontSize: '0.8rem' }}>
                              {"★".repeat(Math.round(store.rating)) + "☆".repeat(5 - Math.round(store.rating))}
                            </span>
                            <span style={{ color: '#95a5a6', fontSize: '0.7rem' }}>({store.rating.toFixed(1)})</span>
                          </>
                        ) : (
                          <span style={{ color: '#bdc3c7', fontSize: '0.7rem' }}>Sin valorar</span>
                        )
                      ) : (
                        <span style={{ color: '#bdc3c7', fontSize: '0.7rem' }}>📍 Punto de interés</span>
                      )}
                    </div>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#95a5a6' }}>
                      {store.address}
                    </p>
                  </div>
                </div>

                {store.isCustom && (
                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#d1e7dd', color: '#0f5132', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      COMUNIDAD
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(store.spot_id);
                      }}
                      style={{ padding: '4px 8px', backgroundColor: '#00473C', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Ver detalles
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </aside>
  );
};