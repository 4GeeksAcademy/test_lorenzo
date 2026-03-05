import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ stores, selectedStore, setSelectedStore }) => {
  const navigate = useNavigate();

  // Función lógica para asignar el icono visual según la categoría técnica
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
      {/* Cabecera Fija */}
      <header style={{
        padding: '12px 15px',
        backgroundColor: '#00473C',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
          📍 Lugares ({stores.length})
        </h2>
      </header>

      {/* Contenedor de la lista */}
      <div style={{ padding: '10px' }}>
        {stores.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            <p style={{ fontSize: '0.9rem' }}>Busca en el mapa...</p>
          </div>
        ) : (
          stores.map((store) => {
            // Comprobamos si este elemento es el que está seleccionado en el mapa
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
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {/* Info principal del Spot */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }} role="img" aria-label="icon">
                    {getCategoryIcon(store.category)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0', fontSize: '0.95rem', color: '#2c3e50', lineHeight: '1.2' }}>
                      {store.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                      {store.isCustom ? (
                        // Lógica para puntos de TU base de datos
                        store.rating ? (
                          <>
                            <span style={{ color: '#FFB800', fontSize: '0.8rem' }}>
                              {"★".repeat(Math.round(store.rating)) + "☆".repeat(5 - Math.round(store.rating))}
                            </span>
                            <span style={{ color: '#95a5a6', fontSize: '0.7rem' }}>({store.rating.toFixed(1)})</span>
                          </>
                        ) : (
                          <span style={{ color: '#bdc3c7', fontSize: '0.7rem', fontStyle: 'italic' }}>Pendiente de valorar</span>
                        )
                      ) : (
                        // Lógica para puntos de Mapbox (Supermercados, etc.)
                        <span style={{ color: '#bdc3c7', fontSize: '0.7rem' }}>📍 Punto de interés</span>
                      )}
                    </div>

                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#95a5a6' }}>
                      {store.address}
                    </p>
                  </div>
                </div>

                {store.isCustom && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: '8px'
                  }}>
                    <span style={{
                      fontSize: '0.65rem',
                      backgroundColor: '#d1e7dd',
                      color: '#0f5132',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      COMUNIDAD
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/spots');
                      }}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#00473C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Ver más
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