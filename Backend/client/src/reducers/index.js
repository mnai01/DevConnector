import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

// takes all the reducers and combines then. Then when you use getStore it calls every reducer and returns the values frome each in an object

console.log('IN REDUCER INDEX');
export default combineReducers({ alert, auth });
