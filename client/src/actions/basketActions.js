
// import token definitions (to avoid typing errors)
import {BASKET_OPEN, BASKET_CLOSE, BASKET_ITEM_ADD, BASKET_ITEM_LESS, BASKET_ITEM_MORE, BASKET_TOGGLE} from '../actions/types';


// Open and close basket page dropdown
export const basket_open = () => {
  return {
    type: BASKET_OPEN
  }
}
export const basket_close = () => {
  return {
    type: BASKET_CLOSE
  }
}
export const basket_toggle = () => {
  return {
    type: BASKET_TOGGLE
  }
}

// Add a painting or cards to order.
// itemID = paintingID
export const basket_item_add = (itemID) => {
  return {
    type: BASKET_ITEM_ADD,
    payload: {
      itemID: itemID
    }
  }
}

// Increase item count by 1
// itemID = paintingID
export const basket_item_more = (itemID) => {
  return ({
    type: BASKET_ITEM_MORE,
    payload: {
      itemID: itemID
    }
  })
}

// Decrease item count by 1
// itemID = paintingID
export const basket_item_less = (itemID) => {
  return ({
    type: BASKET_ITEM_LESS,
    payload: {
      itemID: itemID
    }
  })
}
