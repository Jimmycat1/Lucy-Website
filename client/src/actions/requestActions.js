import { SET_REQUEST_NULL, SET_REQUEST, SET_REQUEST_FAIL, SET_REQUEST_SUCCESS, SET_REQUEST_ERROR, CLEAR_REQUEST_ERROR } from './types';
import PROXY from './PROXY';

import {uuid} from 'uuidv4';


export const clearRequest = (REQUEST_ID) => {
    return {
        type: SET_REQUEST_NULL,
        payload:{
            REQUEST_ID: REQUEST_ID
        }
    }
}

export const setNewRequest = (id, display = false) => (dispatch) => {
    // Display arguement tells whether to display errors or success to user.
    let REQUEST_ID = uuid();
    dispatch({
        type: SET_REQUEST,
        payload: {
            REQUEST_ID,
            id,
            display: display
        }
    })
    return REQUEST_ID;
}


export const requestSuccess = (REQUEST_ID) => (dispatch) => {
    dispatch({
        type: SET_REQUEST_SUCCESS,
        payload: {
            REQUEST_ID: REQUEST_ID
        }
    })
}
export const requestFail = (REQUEST_ID) => (dispatch) => {
    dispatch({
        type: SET_REQUEST_FAIL,
        payload: {
            REQUEST_ID: REQUEST_ID
        }
    })
}

export const displayRequestError = (REQUEST_ID, ERROR_ID, details=[]) => (dispatch) => {
    dispatch({
        type: SET_REQUEST_ERROR,
        payload: {
            REQUEST_ID: REQUEST_ID,
            error: {
                ERROR_ID,
                details
            }
        }
    })
}

export const  clearRequestError = (REQUEST_ID) => (dispatch) => {
    dispatch({
        type: CLEAR_REQUEST_ERROR,
        payload: {
            REQUEST_ID
        }
    })
}

export const checkFor429 = (REQUEST_ID, status) => (dispatch) => {
    if(status === 429){
        if(!REQUEST_ID){
            REQUEST_ID = setNewRequest('MISC',true)(dispatch);
        }
        displayRequestError(REQUEST_ID, 'TOO_MANY_REQUESTS', ['Please try again at a later time...'])(dispatch);
        requestFail(REQUEST_ID)(dispatch);
        return true;
    }
    return false;
}
