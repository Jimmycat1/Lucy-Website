import { TOGGLE_MENU, OPEN_MENU, CLOSE_MENU } from '../actions/types';

const initialState = {
    isOpen: false
};

export default function(state=initialState, action){
    switch(action.type){
        case TOGGLE_MENU:
            return {isOpen: !state.isOpen}
        
        case OPEN_MENU:
            return {isOpen: true}
        
        case CLOSE_MENU:
            return {isOpen: false}
        
        default:
            return state

    }
}