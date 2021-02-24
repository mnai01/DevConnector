import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../actions/types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  // Checks if token exists
  if (localStorage.token) {
    // set token to axios global header as x-auth-token
    setAuthToken(localStorage.token);
  }

  try {
    // send get request to api/auth. If global header is added as "x-auth-token" and its valided in auth middleware on the backend then sucess
    // if error in token or token missing catch error
    const res = await axios.get('/api/auth');
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    console.log('IN AUTH ERROR');
    console.log(err.message);
    dispatch({ type: AUTH_ERROR });
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // converts object or value to JSON string
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.map((error) => {
        console.log('ERROR ', error);
        dispatch(setAlert(error.msg, 'danger'));
      });
      dispatch({ type: LOGIN_FAIL });
    }
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // converts object or value to JSON string
  const body = JSON.stringify({ name, email, password });
  console.log(name, email, password);

  try {
    // login axios call
    const res = await axios.post('api/users', body, config);

    // if successful call this dispatch
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      // This is what thunk is uses for. Calling a dispatch within a dispatch
      // this can be used to delay a dispatch or make sure its only ran if a condition is met

      // TEST WITHOUT THE FIRST DISPATCH TO SEE IF IT WORKS
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    // else call this dispatch
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
};
