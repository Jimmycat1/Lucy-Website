import { NEW_ERROR_NOTIFICATION, REMOVE_NOTIFICATION, NEW_SUCCESS_NOTIFICATION } from '../actions/types';

const initialState = []

export default function(state = initialState, action){
    switch(action.type){
        case NEW_ERROR_NOTIFICATION:
          return [...state, {
            notification_id: action.payload.notification_id,
            notification_type: 1,
            error_id: action.payload.error_id,
            message: action.payload.message,
          }]
          break;
        case NEW_SUCCESS_NOTIFICATION:
          return [...state, {
            notification_id: action.payload.notification_id,
            notification_type: 0,
            message: action.payload.message,
          }] 
          break;
        case REMOVE_NOTIFICATION:
          return state.filter(notification => (notification.notification_id !== action.payload.id))
          break;
        default:
            return state;
    }
}
