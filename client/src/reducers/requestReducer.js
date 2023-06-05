import { SET_REQUEST, SET_REQUEST_FAIL, SET_REQUEST_SUCCESS, SET_REQUEST_RESPONSE, SET_REQUEST_NULL, SET_REQUEST_ERROR, CLEAR_REQUEST_ERROR } from '../actions/types';


const initialRequestState = {
    id: '',
    isPending: false,
    success: false,
    response: {},
    display: false,
}

function editOneRequest(REQUEST_ID , state = initialRequestState, action) {
    switch (action.type) {
        case SET_REQUEST:
            return { ...state, REQUEST_ID, id: action.payload.id, display: action.payload.display, isPending: true };

        case SET_REQUEST_SUCCESS:
            return { ...state, isPending: false, success: true };

        case SET_REQUEST_FAIL:
            return { ...state, isPending: false, success: false };

        case SET_REQUEST_RESPONSE:
            return { ...state, response: action.payload.response};
        
        case SET_REQUEST_ERROR:
            return { ...state, response: {
                error: {
                    ERROR_ID : action.payload.error.ERROR_ID,
                    details: action.payload.error.details,
                }
            }}
        
        case CLEAR_REQUEST_ERROR:
            return {...state, response: {
                error: undefined
            }}

        default:
            return state;
    }
}


const inititalState = [

];

export default function requestReducer(state = inititalState, action){
    switch(action.type){

        case SET_REQUEST:
            // Add new request to list
            return [...state, editOneRequest(action.payload.REQUEST_ID, undefined, action)]
            
        case SET_REQUEST_NULL:
            //  Return all requests except one with selected REQUEST_ID
            return  state.filter(request => {
                        return (request.REQUEST_ID !== action.payload.REQUEST_ID)
                    })

        case SET_REQUEST_FAIL:
        case SET_REQUEST_SUCCESS:
        case SET_REQUEST_ERROR:
        case CLEAR_REQUEST_ERROR:
        case SET_REQUEST_RESPONSE:
            // Filter all through and change the one needed by REQUEST_ID
            let newState = state.map(request => {
                if(request.REQUEST_ID === action.payload.REQUEST_ID){
                    return editOneRequest(
                        action.payload.REQUEST_ID,
                        state.filter(request => (request.REQUEST_ID===action.payload.REQUEST_ID))[0], 
                        action
                    );
                } else {
                    return request;
                }
            });

            if(newState){
                return newState
            } else {
                return state
            }
        
        default:
            return state;
    }
}