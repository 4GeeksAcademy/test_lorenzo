const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllSpots = async () => {
    try {
        //  Limpiamos la URL por si hay dobles barras
        const cleanUrl = `${API_URL}/api/spots`.replace(/([^:]\/)\/+/g, "$1");
        console.log("🔍 Intentando conectar a:", cleanUrl);
        
        const response = await fetch(cleanUrl); 
        
        // Verificamos el tipo de contenido antes de procesar
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            const errorText = await response.text();
            console.error("❌ El servidor respondió con HTML en lugar de JSON. Probablemente un error 404 o 500 del Backend.");
            return [];
        }

    } catch (error) {
        console.error("❌ Error de red o conexión:", error);
        return [];
    }
};

export const SpotData = async (dispatch) =>{
    const data = await getAllSpots()

    if (data && Array.isArray(data)) {
            dispatch({
                type: "set_spot",
                payload: data
            });
            console.log("Spots cargados en el store");
        } else {
            console.log("No se recibieron spots");
        }
}