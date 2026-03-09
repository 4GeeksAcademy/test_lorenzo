export const initialStore=()=>{
  return{
    message: null,
    vans: [],
    spot:[],
    booking: [],
    fav_vans:[],
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case "set_vans":
        return {
          ...store,
          vans: action.payload
        }

    case "fav_vans":
        return{
          ...store,
          fav_vans: action.payload

        }
    
    case "set_spot":
      return{
        ...store,
        spot: action.payload
      }
      
    case "set_booking":
      return{
          ...store,
          booking: action.payload
      }
    
    case "add_booking":
      return{
        ...store,
        booking: [...store.booking, action.payload]
      }

    default:
      throw Error('Unknown action.');
  }    
}
