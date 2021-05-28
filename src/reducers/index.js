
import logReducer from './login';

import {combineReducers} from 'redux';

const reducersList = combineReducers({
    login: logReducer
})

export default reducersList;