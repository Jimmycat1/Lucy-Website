import {SET_PAINTINGS_LOADING, GET_PAINTING_IDS, GET_ONE_PAINTING, GET_ALL_PAINTINGS, DELETE_PAINTING_BY_ID, UPDATE_PAINTING_FILENAMES } from '../actions/types';

const initialState = {
    paintingIdList: [],
    paintingDict:
        JSON.parse(sessionStorage.getItem('paintingDict'))
        || {},
    allLoading: false
}

export default function(state = initialState, action){
    let newPD = {};
    switch(action.type){

        case SET_PAINTINGS_LOADING:
            return {...state, allLoading: true}

        case GET_ALL_PAINTINGS:
            sessionStorage.setItem('paintingDict', JSON.stringify(action.payload));
            return {...state,
                paintingDict: action.payload,
                allLoading:false,
            }

        case GET_ONE_PAINTING:
            newPD = {...state.paintingDict};
            newPD[action.payload.id] = action.payload.painting;
            sessionStorage.setItem('paintingDict', JSON.stringify(newPD))
            return {...state,
                paintingDict: newPD
            }

        case DELETE_PAINTING_BY_ID:
            newPD = {...state.paintingDict}
            newPD[action.payload.id] = {}
            return {...state,
              paintingIdList: state.paintingIdList.filter((id)=>(id!==action.payload.id)),
              paintingDict: newPD
            }

        case UPDATE_PAINTING_FILENAMES:
            newPD = {...state.paintingDict}
            newPD[action.payload.paintingID].filename = action.payload.filenames;

        case GET_PAINTING_IDS:
            return {...state,
                paintingIdList: action.payload,
            }

        default:
            return state;
    }
}
