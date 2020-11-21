/* 
A store holds the whole state tree of your application. 
The only way to change the state inside it is to dispatch an action on it. 

A store is not a class.  It's just an object with a few methods on it. 
To create it, pass your root reducing function to createStore .
*/
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// Redux Thunk is a middleware that lets you call action creators that return a function instead of an action object.
import thunk from 'redux-thunk';
// Holds all the reducers
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
