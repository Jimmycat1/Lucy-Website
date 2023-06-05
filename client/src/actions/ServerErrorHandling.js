
import {uuid} from 'uuidv4';
import { NEW_ERROR_NOTIFICATION, REMOVE_NOTIFICATION, NEW_SUCCESS_NOTIFICATION } from './types';
import { contact_email } from '../config';

export const handle_error_to_user = (err) => (dispatch) => {
  if (!err.response || !err.response.status){
    console.log('1')
    dispatch({
      type: NEW_ERROR_NOTIFICATION,
      payload: {
        notification_id: uuid(),
        error_id: -1,
        message: 'The server seems to have disconnected. Maybe check your Internet connection?'
      }
    })
    return;
  }

  if(err.response.status === 429){
    dispatch({
      type: NEW_ERROR_NOTIFICATION,
      payload: {
        // INCLUDES EMAIL of artist
        notification_id: uuid(),
        error_id: -3,
        message: `Sorry, but this service is experiencing too many requests at the moment. Please return later, or contact me: ${contact_email}.`
      }
    })
    return;
  }

  let answer = err.response.data;
  if (!answer || (answer.error_id===undefined) || !answer.message){
    dispatch({
      type: NEW_ERROR_NOTIFICATION,
      payload: {
        // INCLUDES EMAIL of artist
        notification_id: uuid(),
        error_id: -2,
        message: `Something seems to be wrong in the code. It would be good if you could report this error (-2) to me: ${contact_email} . Thanks, and sorry.`
      }
    })
    return;
  }

  dispatch({
    type: NEW_ERROR_NOTIFICATION,
    payload: {
      notification_id: uuid(),
      error_id: answer.error_id,
      message: answer.message
    }
  })
}

export const report_success_notification = (res) => (dispatch) => {
  if (!res.data){
    dispatch({
      type: NEW_ERROR_NOTIFICATION,
      payload: {
        // INCLUDES EMAIL of artist
        notification_id: uuid(),
        error_id: -2,
        message: `Something seems to be wrong in the code. It would be good if you could report this error (-2) to me: ${contact_email} . Thanks, and sorry.`
      }
    })
    return }
  dispatch({
    type: NEW_SUCCESS_NOTIFICATION,
    payload: {
      notification_id: uuid(),
      message: res.data.message || "",
    }
  })
}

export const display_custom_notification = (message, is_success) => (dispatch) => {
  if (is_success === true){
    dispatch({
      type: NEW_SUCCESS_NOTIFICATION,
      payload: {
        notification_id: uuid(),
        message: message
      }
    })
  } else {
    dispatch({
      type: NEW_ERROR_NOTIFICATION,
      payload: {
        notification_id: uuid(),
        error_id: undefined,
        message: message
      }
    })
  }
}

export const removeNotification = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_NOTIFICATION,
    payload: {
      id: id
    }
  })
}
