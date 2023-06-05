
import PROXY from './PROXY';

import axios from 'axios';

import { setNewRequest, requestFail, requestSuccess, displayRequestError } from './requestActions';
import { addPaintingToDict } from './paintingsActions';
import { checkFor429} from './requestActions';
import { handle_error_to_user, display_custom_notification, report_success_notification } from './ServerErrorHandling';
import { getPainting } from './paintingsActions';

export const updatePainting = ({ id, newPainting }) => (dispatch) => {

    if (id) {
        // Body
        const body = newPainting;

        axios.patch(`${PROXY}/api/painting/${id}`, body )
            .then(res => {
                /* update the painting locally */
                addPaintingToDict(id, newPainting)(dispatch);
            })
            .catch(err => {
                handle_error_to_user(err)(dispatch)
            });
    }
}

export const deletePainting = (id) => (dispatch) => {
    const REQUEST_ID = setNewRequest('DELETE_PAINTING', true)(dispatch);

    if(id){

        axios.delete(`${PROXY}/api/painting/${id}`)
            .then(res => {
                requestSuccess(REQUEST_ID)(dispatch)
            })
            .catch(err => {
                handle_error_to_user(err)(dispatch)
                requestFail(REQUEST_ID)(dispatch);
            })
    }
}

/*
const editPaintingFilenames = (paintingID, filenames, type) => (dispatch) => {
    if (paintingID && filenames){
        if (type==='add' || type==='remove'){

            const REQUEST_ID = setNewRequest('EDIT_PAINTING_PHOTOS')(dispatch);

            const data = {};
            data[type] = [...filenames];

            return new Promise((resolve, reject) => {
                axios.patch(`${PROXY}/api/painting/${paintingID}/photos`, data)
                .then(res => {

                    requestSuccess(REQUEST_ID)(dispatch);
                    resolve(res.status);
                })
                .catch(err => {
                    //Check if just too many requests
                    handle_error_to_user(err)(dispatch)
                    requestFail(REQUEST_ID)(dispatch);
                    reject(err);
                })
            })
        }
    }
}
*/

/*
export const saveImages = (images, paintingID) => (dispatch) => {
    for (let image of images){
        const REQUEST_ID = setNewRequest('SAVE_IMAGE')(dispatch);

        const data = new FormData();
        data.append('file', image);

        axios
            .post(`${PROXY}/api/upload`, data)
            .then(res => {
                requestSuccess(REQUEST_ID)(dispatch);
                // Add filename to painting
                editPaintingFilenames(paintingID, [res.data.imageURL], 'add')(dispatch);
            })
            .catch(err => {
                requestFail(REQUEST_ID)(dispatch);
            })
    }
} */

const saveImage = image => (dispatch) => {
    const data = new FormData();
    data.append('file', image);

    return axios
        .post(`${PROXY}/api/upload`, data)
        .then(res => {
            return { imageURL: res.data.imageURL, error: false };
        })
        .catch(err => {
            //Check if just too many requests
            handle_error_to_user(err)(dispatch)
            return { imageURL: null, error: true };
        })
}


export const updatePainting_add_image = ({image, paintingID}) => async (dispatch) => {
    return saveImage(image)(dispatch)
        .then(({imageURL, error}) => {
            if(error !== true){
              return updatePainting_add_filename({paintingID: paintingID, filename:imageURL})(dispatch)
                  .then(success => {
                    if (success === true){
                      getPainting(paintingID)(dispatch)
                      return true;
                    } else {
                      return false;
                    }
                  })
            } else {
              return false ;
            }
        })
}

export const updatePainting_delete_filename = ({filename, paintingID}) => async (dispatch) => {
    return axios.patch(`${PROXY}/api/painting/${paintingID}/photos/delete/filename`, {'filename': filename})
      .then(res => {
        getPainting(paintingID)(dispatch)
        return true;
      })
      .catch(err => {
        handle_error_to_user(err)(dispatch)
        return false
      })
}

export const updatePainting_add_filename = ({filename, paintingID}) => async (dispatch) => {
    return axios.patch(`${PROXY}/api/painting/${paintingID}/photos/add/filename`, {'filename': filename})
      .then(res => {
        return true
      })
      .catch(err => {
        handle_error_to_user(err)(dispatch)
        return false
      })
}

const submitPaintingImagesRecursive = ( addImages, deleteImages, paintingID, actionID = 0, successRate=0) => async (dispatch) => {
    // This function first saves all images present in addImages.
    // It does this by recursively calling itself, incrementing actionID with each call.
    // Once actionID gets higher than addImages length, it deletes files in deleteImages.

    let success;
    if (actionID < addImages.length){
        success = await updatePainting_add_image( addImages[actionID], paintingID )(dispatch)
    } else if ( actionID < (addImages.length + deleteImages.length)){
        success = await updatePainting_delete_filename(deleteImages[actionID - addImages.length], paintingID)(dispatch)
    } else {
        // End here
        if(successRate === (addImages.length + deleteImages.length)){
            return true
        } else {
            return false
        }
    }

    if(success===true){
        successRate += 1
    }

    return await submitPaintingImagesRecursive(addImages, deleteImages, paintingID, actionID + 1, successRate)(dispatch)
}

export const submitPaintingImages_elder = ( addImages, deleteImages, paintingID) => async (dispatch) => {

    const REQUEST_ID = setNewRequest('EDIT_PAINTING_IMAGES', true)(dispatch);

    let success = await submitPaintingImagesRecursive(addImages, deleteImages, paintingID)(dispatch)


    if(success===true){
        requestSuccess(REQUEST_ID)(dispatch);
    } else {
        requestFail(REQUEST_ID)(dispatch);
    }
}

export const submitPaintingImages = (add_these_Images, delete_these_Filenames, paintingID) => async (dispatch) => {

  // Upload photos and receive filenames
  let image_filenames = []
  let uploads_successful = true;
  let upload_errors = []
  for (let image of add_these_Images){
        const data = new FormData();
        data.append('file', image);
        try{

          let save = await axios.post(`${PROXY}/api/upload`, data)
          image_filenames.push(save.data.imageURL);

        } catch(err) {
          uploads_successful = false
          upload_errors.push(err)
        }
  }

  // Quit if there are errors with uploading
  if (uploads_successful !== true){
    display_custom_notification('Some photos were not uploaded. As a result, the whole update was cancelled. Please contact the developer, if needed. Thank you!', false)(dispatch)
    for (let err of upload_errors){
      handle_error_to_user(err)(dispatch)
    }
    return false;
  }

  // Add filenames to painting model in DB
  try {
    await axios.patch(`${PROXY}/api/painting/${paintingID}/photos`, {'add':image_filenames})
  } catch(err) {
    display_custom_notification('Photos could not be added, for some reason. No photos wil be deleted either.', false)(dispatch)
    handle_error_to_user(err)(dispatch)
    return false
  }

  // Now delete filenames
  try {
    await axios.patch(`${PROXY}/api/painting/${paintingID}/photos`, {'delete': delete_these_Filenames})
  } catch(err) {
    display_custom_notification('Photos could not be deleted, for some reason. However, the photos that needed to be added were added. Sorry.', false)(dispatch)
    handle_error_to_user(err)(dispatch)
    return false;
  }

  // Success message
  display_custom_notification('Photo upload successful.', true)(dispatch)

  // Update painting in dictionary
  getPainting(paintingID)(dispatch)

  return true;
}

export const addPainting = (name, image) => (dispatch) => {
    saveImage(image)(dispatch)
        .then(({imageURL, error}) => {
          if (error !== true){
            const data = {
                name,
                filename: [imageURL]
            };

            axios.post(`${PROXY}/api/painting`, data)
                .then(res => {
                    // Update dictionary on frontend
                    addPaintingToDict(res.data);
                    window.location.href=`/admin/paintings/${res.data._id}/edit`;
                })
                .catch((err) => {
                    handle_error_to_user(err)(dispatch)
                    return false;
                })
          } else {
            return false;
          }
        })
}
