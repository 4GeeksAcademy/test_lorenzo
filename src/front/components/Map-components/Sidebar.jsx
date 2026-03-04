import React, { useEffect, useRef } from 'react';

// 1. Añadimos filters y setFilters a las props que recibe el componente
export const Sidebar = ({ stores, selectedStore, setSelectedStore, filters, setFilters }) => {
  
  const storeRefs = useRef({});

  useEffect(() => {
    const storeName = selectedStore?.properties?.name || selectedStore?.name;
    if (storeName && storeRefs.current[storeName]) {
      storeRefs.current[storeName].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedStore]);

  return (
    <div style={{
      width: '300px',
      minWidth: '300px',
      height: '100%',
      backgroundColor: '#f4f3e7',
      overflowY: 'auto',
      borderRight: '1px solid #00473C',
      zIndex: 10,
      position: 'relative'
    }}>
      <div style={{ padding: '20px' }}>
        
        {/* Título dinámico */}
        <h2 style={{ color: '#00473C', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>
          {stores && stores.length > 0 
            ? `Lugares encontrados: ${stores.length}` 
            : "Buscando lugares..."}
        </h2>

        {/* --- AQUÍ PODREMOS METER LOS BOTONES DE FILTRO PRÓXIMAMENTE --- */}

        {stores && stores.length > 0 ? (
          stores.map((store, i) => {
            const currentStore = store.properties ? store.properties : store;
            const name = currentStore.name || "Sin nombre";
            const address = currentStore.address || "Sin dirección";
            const phone = currentStore.phoneFormatted || "";

            const isSelected = (selectedStore?.properties?.name || selectedStore?.name) === name;

            return (
              <div
                key={`${name}-${i}`}
                ref={(el) => { if (el) storeRefs.current[name] = el; }}
                onClick={() => setSelectedStore(store)}
                style={{
                  backgroundColor: isSelected ? 'white' : 'rgba(255,255,255,0.4)',
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #00473C' : '1px solid transparent',
                  boxShadow: isSelected ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#00473C', fontWeight: '600' }}>
                  {name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.4' }}>
                  <p style={{ margin: 0 }}><strong>Dirección:</strong> {address}</p>
                  {phone && <p style={{ margin: '5px 0 0 0' }}><strong>Tel:</strong> {phone}</p>}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
             <p>No hay lugares que coincidan con los filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};