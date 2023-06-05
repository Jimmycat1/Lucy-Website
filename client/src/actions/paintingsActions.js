import {
    GET_ALL_PAINTINGS, GET_PAINTING_IDS, GET_ONE_PAINTING, SET_PAINTINGS_LOADING
} from './types';
import PROXY from './PROXY';

import axios from 'axios';

import {handle_error_to_user, report_success_notification} from './ServerErrorHandling';
import {checkFor429} from './requestActions';


export const setPaintingsLoading = () => ({
    type: SET_PAINTINGS_LOADING
});

export const getPaintings = () => dispatch => {
    dispatch(setPaintingsLoading());

    // Get the meta data for all paintings
    axios
        .get(`${PROXY}/api/painting`)
        .then(res => {
            // Meta data
            const paintingsList = res.data;
            const paintingsDict = {}
            for (var i = 0; i < paintingsList.length; i++) {
                const painting = paintingsList[i];
                const paintingID = painting._id;
                paintingsDict[paintingID] = painting;
            }

            // Dispatch the actual action that changes state.
            dispatch({
                type: GET_ALL_PAINTINGS,
                payload: paintingsDict,
            });
        })
        .catch(err => {
            handle_error_to_user(err)(dispatch);
        })
};

export const getPainting = id => dispatch => {
    // Get the meta data for one painting
    axios
        .get(`${PROXY}/api/painting/${id}`)
        .then(res => {
            // Meta data
            const painting = res.data;
            addPaintingToDict(id, painting)(dispatch);
        })
        .catch(err => {
          handle_error_to_user(err)(dispatch)
        })
};

export const addPaintingToDict = (id, painting) => dispatch => {
    // Add the painting to state's dictionary.
    dispatch({
        type: GET_ONE_PAINTING,
        payload: {
          id: id,
          painting: painting
        },
    });
}

export const getPaintingIds = () => dispatch => {
    // Get ids of all paintings
    axios
        .get(`${PROXY}/api/painting/ids`)
        .then(res => {
            const ids = res.data;
            const idList = [];
            for (var i = 0; i < ids.length; i++) {
                idList.push(ids[i]['_id']); // Get _id because also includes dates.
            }

            dispatch({
                type: GET_PAINTING_IDS,
                payload: idList,
            })
        })
        .catch(err => {
            //Check if just too many requests
            handle_error_to_user(err)
        })
}
