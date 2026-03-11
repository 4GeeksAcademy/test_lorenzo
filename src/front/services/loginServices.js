
export const login = async (user) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Erorr al iniciar sesion" };
    }
    return data;
  } catch (error) {
    return { error: "No se pudo conectar con el servidor" };
  }
};


export const editProfile = async(user)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/edit`,
    {
        method: "PUT",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json",
          Authorization :`Bearer ${localStorage.getItem("token")}`
        },
    }
  )
  const data = await response.json();
  return data;
};

export const veryfytoken = async ( dispatch)=> {
  const token = localStorage.getItem("token");

  if(!token){
    if (dispatch) dispatch({ type: "auth_set_user", payload: null });
    return;
  }
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
  {
    headers:{
      authorization:`Bearer ${token}`,
    },
  },
);
if(!response.ok){
  if (dispatch) dispatch({ type: "auth_logout" });
    return;
  }
  const user = await response.json();
  if (dispatch) dispatch({ type: "auth_set_user", payload: user });

};
