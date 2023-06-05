import { combineReducers } from 'redux';
import menuReducer from './menuReducer';
import paintingsReducer from './paintingsReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import requestReducer from './requestReducer';
import basketReducer from './basketReducer';
import notificationsReducer from './notificationsReducer';
import loadersReducer from './loadersReducer';
// Feature flags
import { USE_BASKET } from '../config.js';

const reducers = {
    menu: menuReducer,
    paintings: paintingsReducer,
    errors: errorReducer,
    auth: authReducer,
    requests: requestReducer,
    notifications: notificationsReducer,
    num_loaders: loadersReducer,
}

if (USE_BASKET===true){
  reducers.basket = basketReducer
}

const rootReducer = combineReducers(reducers);

export default rootReducer;
