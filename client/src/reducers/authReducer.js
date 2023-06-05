import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
} from "../actions/types";

let initialState = {};
let parsedJSON = JSON.parse(sessionStorage.getItem('adminDetails'))
if (parsedJSON === null){
  initialState =  {
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }
} else {
  initialState = parsedJSON;
}

export default function (state = initialState, action) {
  let newState;
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case USER_LOADED:
      newState = {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
      sessionStorage.setItem('adminDetails', JSON.stringify(newState))
      return newState;

    case LOGIN_SUCCESS:
      newState = {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
      sessionStorage.setItem('adminDetails', JSON.stringify(newState))
      return newState;

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      newState = {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
      sessionStorage.setItem('adminDetails', JSON.stringify(newState))
      return newState;

    default:
      return state;
  }
}
