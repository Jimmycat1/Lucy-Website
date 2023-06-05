
import {ADD_LOADER, REMOVE_LOADER} from '../actions/types'

export default function( state = 0, action ){
  if (action.type === ADD_LOADER){
    return state + 1
  } else if (action.type === REMOVE_LOADER){
    if (state > 0){
      return state - 1
    } else {
      return state;
    }
  } else {
    return state;
  }
}
