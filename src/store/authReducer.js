const initialState = {
    authUser: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_AUTH_USER':
        return {
          ...state,
          authUser: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;