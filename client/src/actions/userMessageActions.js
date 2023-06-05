import axiosBN from '../utils/axiosBN';
import {setNewRequest, requestSuccess, requestFail, checkFor429, displayRequestError} from './requestActions';
import {ADD_LOADER, REMOVE_LOADER} from './types';
import PROXY from './PROXY';

import {report_success_notification, handle_error_to_user} from './ServerErrorHandling';

// Someone uses contact form to ask a question
export const sendContactFormEmail =  (name, email, message)  => dispatch => {
    dispatch({type: ADD_LOADER})
    axiosBN
        ({
            method: 'post',
            url: `${PROXY}/api/email/`,
            data: {
                user_name: name,
                user_email: email,
                user_message: message,
            }
        })
        .then(res => {
          dispatch({type: REMOVE_LOADER})
          report_success_notification(res)(dispatch)
        })
        .catch(err => {
          dispatch({type: REMOVE_LOADER})
          handle_error_to_user(err)(dispatch)
        });
}


// Customer requests to buy painting, as if by email
// name of person, email, message, boolean if they have any questions, boolean if they want to buy it.
// id of painting comes from workings inside.
export const placeMessageOrder =  ({ paintingID, name, email, message, questions, purchase})  => dispatch => {
    dispatch({type: ADD_LOADER})
    axiosBN
        ({
            method: 'post',
            url: `${PROXY}/api/orderR/${paintingID}`,
            data: {
                user_name: name,
                user_email: email,
                user_message: message,
                purchase, questions
            }
        })
        .then(res => {
          dispatch({type: REMOVE_LOADER})
            report_success_notification(res)(dispatch);
        })
        .catch(err => {
            dispatch({type: REMOVE_LOADER})
            handle_error_to_user(err)(dispatch);
        });
}
