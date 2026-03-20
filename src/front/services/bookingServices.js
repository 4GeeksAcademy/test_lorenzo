const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllBooking = async (dispatch) => {
  const response = await fetch(`${API_URL}/booking/all`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  dispatch({ type: "set_booking", payload: data });
  return data;
};

export const addBooking = async (bookingData, dispatch) => {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/booking/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();
  dispatch({ type: "add_booking", payload: data });
  return data;
};
export const getUserBookings = async (userId, dispatch) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/booking/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const data = await response.json();
  dispatch({ type: "set_bookings", payload: data });
  return data;
};
export const cancelBooking = async (bookingId, dispatch) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/booking/cancel/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const data = await response.json();

  if (response.ok) {
    dispatch({ type: "cancel_booking", payload: bookingId });
  }

  return data;
};