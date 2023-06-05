import axios from "axios";
import axiosBN from '../utils/axiosBN';
import {handle_error_to_user} from './ServerErrorHandling';

import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
} from "./types";

import PROXY from './PROXY';

import { setNewRequest, requestFail, displayRequestError, requestSuccess, checkFor429 } from "./requestActions";

// Load your details when already logged in.
export const loadUser = () => (dispatch, getState) => {
  const REQUEST_ID = setNewRequest('LOAD_USER', false)

  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get(`${PROXY}/api/admin/auth/user`)
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      //Check if just too many requests
      if(checkFor429(REQUEST_ID, err.response.status)(dispatch)){
        return
      }
      dispatch({ type: AUTH_ERROR });
    });
};


export const login = ({ username, password }) => (dispatch) => {
  // User loading
  dispatch({ type: USER_LOADING });
  const REQUEST_ID = setNewRequest('LOGIN', true)(dispatch);

  // Headers
  const headers = {
    "Content-Type": "application/json",
  };

  // Body
  const body = JSON.stringify({ name: username, password: password });

  // Request
  axiosBN({
    method: 'post',
    url: `${PROXY}/api/admin/auth`,
    data: body,
    headers: headers
  })
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      requestSuccess(REQUEST_ID)(dispatch);
    })
    .catch((err) => {
      //Check if just too many requests
      //if(checkFor429(REQUEST_ID, err.response.status)(dispatch)){
        //dispatch({
          //type: LOGIN_FAIL,
        //});
        //return
      //}

      handle_error_to_user(err)(dispatch)
      dispatch({
        type: LOGIN_FAIL,
      });
      requestFail(REQUEST_ID)(dispatch);
      // displayRequestError(REQUEST_ID, 'LOGIN_FAILED')(dispatch);
    });
};

export const logout = () => dispatch =>{
  axios({
    method: 'post',
    url: `${PROXY}/api/admin/auth/logout`
  }).then(res => {
    dispatch({ type: LOGOUT_SUCCESS });
  }).catch(err => {
    handle_error_to_user(err)(dispatch)
  })
};
