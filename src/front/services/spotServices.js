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

// # para obtener el detalle de un solo punto por su ID
export const getSpotById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/spot/spots/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error cargando el detalle:", error);
        return null; 
    }
};

// # Para crear un nuevo punto en la base de datos
export const createSpot = async (spotData) => {
    const token = localStorage.getItem("token"); 

    // SEGURIDAD: Si no hay token, avisamos antes de romper el backend
    if (!token) {
        console.error("No hay token en localStorage. Debes iniciar sesión.");
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/spot/spots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(spotData)
        });

        if (response.ok) {
            return await response.json();
        }
        
        const errorDetail = await response.json();
        return null;
    } catch (error) {
        console.error("Error de conexión:", error);
        return null;
    }
};
//para añadir una foto al spot
export const addSpotMedia = async (spotId, imageUrl) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/spot/spots/${spotId}/media`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                url: imageUrl,
                media_type: "image"
            })
        });
        return response.ok;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return false;
    }
};