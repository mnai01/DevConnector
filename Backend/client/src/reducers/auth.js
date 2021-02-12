import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  // payload will represent the users data
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return { ...state, user: payload, isAuthenticated: true, loading: false };

    // These 2 types do the same thing
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };

    // These 3 types do the same thing
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
      // remove token from storage
      localStorage.removeItem('token');
      // set value to null
      return { ...state, token: null, isAuthenticated: false, loading: false };

    default:
      return state;
  }
}
