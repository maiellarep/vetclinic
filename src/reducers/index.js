
import logReducer from './login';
import clientsReducer from './clients';

import {combineReducers} from 'redux';

const reducersList = combineReducers({
    login: logReducer,
    clients: clientsReducer
})

export default reducersList;