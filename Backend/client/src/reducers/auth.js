import { REGISTER_FAIL, REGISTER_SUCESS } from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCESS:
      // add token to storage
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
      // remove token from storage
      localStorage.removeItem('token');
      // set value to null
      return { ...state, payload, isAuthenticated: false, loading: false };
    default:
      return state;
  }
}
