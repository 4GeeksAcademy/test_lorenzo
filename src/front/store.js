export const initialStore=()=>{
  return{
    message: null,
    vans: [],
    booking: [],
    token: localStorage.getItem("token") || null,
    user:[],
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
    case "auth_login":{
      const{token}= action.payload;
      localStorage.setItem("token",token);
      return{...store,token};
    }
    case"auth_set_user":
    return{...store, user:action.payload};
    case"auth_logout":
    localStorage.removeItem("token");
    return{...store, token:null,user:null,authReady:true};
    default:
      throw Error('Unknown action.');
  }    
}
