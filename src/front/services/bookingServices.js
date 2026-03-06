const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllBooking = async (dispatch) => {
  const response = await fetch(`${API_URL}/booking/all`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  dispatch({ type: "set_booking", payload: data });
};

export const addBooking = async (bookingData, dispatch) => {
  const response = await fetch(`${API_URL}/booking/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();
  dispatch({ type: "add_booking", payload: data });
};
