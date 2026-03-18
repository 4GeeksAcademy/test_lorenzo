export const initialStore = () => {
  return {
    message: null,
    vans: [],
    booking: [],
    token: localStorage.getItem("token") || null,
    user: [],
    spot: [],
    fav_vans: [],
    fav_spots: [],
    authReady: false,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "set_vans":
      return {
        ...store,
        vans: action.payload,
      };

    case "fav_vans":
      return {
        ...store,
        fav_vans: action.payload,
      };

    case "set_spot":
      return {
        ...store,
        spot: action.payload,
      };

    case "set_bookings":
      return {
        ...store,
        booking: action.payload,
      };

    case "add_booking":
      return {
        ...store,
        booking: [...store.booking, action.payload],
      };

    case "auth_login": {
      const { token } = action.payload;
      localStorage.setItem("token", token);
      return { ...store, token };
    }

    case "auth_set_user":
      return { ...store, user: action.payload };

    case "auth_logout":
      localStorage.removeItem("token");

      return { ...store, token: null, user: null, authReady: true };

    case "set_fav_spots":
      return {
        ...store,
        fav_spots: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
