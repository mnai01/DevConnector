import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';

// takes all the reducers and combines then. Then when you use getStore it calls every reducer and returns the values frome each in an object
// each state will be help is the reducer with an obj name of it self
console.log('IN REDUCER INDEX');
export default combineReducers({ alert, auth, profile });
