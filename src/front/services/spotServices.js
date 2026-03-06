const API_URL = import.meta.env.VITE_BACKEND_URL;

// # Obtener la lista completa de puntos (Spots)
export const getAllSpots = async () => {
    try {
        const response = await fetch(`${API_URL}/spot/spots`); 
        
        if (!response.ok) {
            console.error("Error al obtener los spots");
            return []; // # Devuelve lista vacía si falla la API
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return [];
    }
};

// # Obtener el detalle de un solo punto por su ID
export const getSpotById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/spot/spots/${id}`);
        
        if (!response.ok) {
            console.error("No se encontró el detalle del spot");
            return null; // # Devuelve null si el ID no existe
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error cargando el detalle:", error);
        return null; 
    }
};