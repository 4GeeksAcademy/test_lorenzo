
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

export const SpotData = async (dispatch) => {
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

// --- Fetch para comentarios  ---

export const getAllComments = async () => {
    try {
        const response = await fetch(`${API_URL}/coment/coment`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error al traer comentarios:", error);
        return [];
    }
};


export const createComment = async (spotId, text, rating) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/coment/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                spot_id: spotId,
                coment: text,
                rating: rating
            })
        });
        return response.ok;
    } catch (error) {
        console.error("Error al crear comentario:", error);
        return false;
    }
};

export const updateComment = async (commentId, text, rating) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/coment/edit/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                coment: text,
                rating: rating
            })
        });
        return response.ok;
    } catch (error) {
        console.error("Error al editar:", error);
        return false;
    }
};

export const deleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/coment/del/${commentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error("Error al borrar:", error);
        return false;
    }
};

export const toggleFavorite = async (spotId, isFav) => {
    const token = localStorage.getItem("token");
    const method = isFav ? "DELETE" : "POST";
    try {
        const response = await fetch(`${API_URL}/spot/favorites/${spotId}`, {
            method: method,
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

export const checkIfFavorite = async (spotId) => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const response = await fetch(`${API_URL}/spot/favorites/${spotId}/check`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        return data.isFavorite;
    } catch (error) {
        return false;
    }
};

export const getUserFavorites = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No hay token, no pido favoritos");
        return [];
    }

    const response = await fetch(`${API_URL}/spot/favorites`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token  
        }
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.log("Error al traer favoritos:", response.status);
        return [];
    }
};