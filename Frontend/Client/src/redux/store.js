import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { authReducer } from './reducers/authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  auth: {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
  },
};

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default store;
