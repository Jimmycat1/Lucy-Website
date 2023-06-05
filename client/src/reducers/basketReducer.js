
import {BASKET_OPEN, BASKET_CLOSE, BASKET_TOGGLE, BASKET_ITEM_ADD, BASKET_ITEM_LESS, BASKET_ITEM_MORE} from '../actions/types';

let initialState = {};
// Try to set state from saved browser storage
const MaybePersistedState = sessionStorage.getItem('basket_state');
if ((MaybePersistedState)&&(MaybePersistedState!=="undefined")){
  initialState = JSON.parse(MaybePersistedState);
} else {
  initialState = {
    DropdownOpen: false,
    numItems: 0,
    // List of {id: itemID, count: INT}
    items: []
  }
}

// TODO : retain info across pages.

function basketReducer(state = initialState, action){
  // Track whether state changed to persist to session storage if so.
  let updated = true;
  let newState = {...state};
  switch(action.type){

    // Open and close dropdown page
    case BASKET_OPEN:
      newState =  {
        ...state,
        DropdownOpen: true
      };
      break;
    case BASKET_CLOSE:
      newState =  {
        ...state,
        DropdownOpen: false
      };
      break;
    case BASKET_TOGGLE:
      newState =  {
        ...state,
        DropdownOpen: !state.DropdownOpen
      };
      break;

    // Add painting or cards to order.
    // payload: {itemID: 'ID'}
    case BASKET_ITEM_ADD:
      // See if item is already added
      let found = false;
      for (let i=0; i < state.items.length; i++){
        if (state.items[i].id === action.payload.itemID){
          found = true;
          // if yes, use reducer to add to count of item.
          newState =  basketReducer(state, {
            type: BASKET_ITEM_MORE,
            payload: {
              itemID: action.payload.itemID
            }
          })
        }
      }
      if (found !== true) {
        // if here, then item is new, indeed.
        // Add item to List
        newState =  {
          ...state,
          items: [...state.items, { id: action.payload.itemID, count:1 }, ],
          numItems: state.numItems + 1,
        }
      }
      break;

    // Add one more of the same item
    // payload: {itemID: 'ID'}
    case BASKET_ITEM_MORE:
      // Find item in state and add 1 to count
      newState =  {
        ...state,
        numItems: state.numItems + 1,
        items: state.items.map((item) => {
          if (item.id === action.payload.itemID){
            item.count += 1;
          }
          return item;
        })
      }
      break;

    // Remove one of these items.
    // payload: {itemID: 'ID'}
    case BASKET_ITEM_LESS:
      // Find item in state and decrease by 1
      // Remove item if 0.
      newState =  {
        ...state,
        numItems: state.numItems - 1,
        items:
          state.items
            .map((item) => {
              if (item.id === action.payload.itemID){
                item.count -= 1;
              }
              return item;
            })
            .filter((item) => {
              return  (item.count !== 0)
            })
      }
      break;

    default:
      updated = false;
      break;

  }

  // Save changes to session sessionStorage.
  // POTENTIAL PERFORMANCE FIX
  if (updated === true){
    sessionStorage.setItem('basket_state', JSON.stringify(newState))
  }
  return newState;
}

export default basketReducer;
