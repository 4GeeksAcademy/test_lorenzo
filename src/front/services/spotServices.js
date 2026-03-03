const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllSpots = async () => {
    try {
        // 1. Limpiamos la URL por si hay dobles barras
        const cleanUrl = `${API_URL}/api/spots`.replace(/([^:]\/)\/+/g, "$1");
        console.log("🔍 Intentando conectar a:", cleanUrl);
        
        const response = await fetch(cleanUrl); 
        
        // 2. Verificamos el tipo de contenido antes de procesar
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            // Si llega aquí, es que el servidor respondió con HTML (error)
            const errorText = await response.text();
            console.error("❌ El servidor respondió con HTML en lugar de JSON. Probablemente un error 404 o 500 del Backend.");
            return [];
        }

    } catch (error) {
        console.error("❌ Error de red o conexión:", error);
        return [];
    }
};