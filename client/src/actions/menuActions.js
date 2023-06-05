import { TOGGLE_MENU, OPEN_MENU, CLOSE_MENU } from './types';


export const openMenu = () => {
    return ({
        type: OPEN_MENU
    })
}

export const closeMenu = () => {
    return ({
        type: CLOSE_MENU
    })
}

export const toggleMenu = () => {
    return ({
        type: TOGGLE_MENU
    })
}