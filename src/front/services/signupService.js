export const signUp = async (user) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
        return { error: data.error || "Error al registrarse" }; 
    }

    return data; 
}