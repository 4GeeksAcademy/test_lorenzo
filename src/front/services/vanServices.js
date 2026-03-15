const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllVans = async (dispatch) => {
    const response = await fetch (
        `${API_URL}/van/vehicles`
    )

    const data = await response.json()
    console.log(data);
    
    dispatch({type:"set_vans", payload: data.vehicles || data})
}

export const getSingleVan = async (id) => {
    const response = await fetch(`${API_URL}/van/vehicles/${id}`); 
    if (!response.ok);
    const data = await response.json();
    return data;
};