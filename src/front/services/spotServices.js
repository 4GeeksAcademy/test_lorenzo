const API_URL = import.meta.env.VITE_BACKEND_URL;

// # para obtener la lista completa de puntos (Spots)
export const getAllSpots = async () => {
    try {
        const response = await fetch(`${API_URL}/spot/spots`); 
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
        return [];
    }
};
