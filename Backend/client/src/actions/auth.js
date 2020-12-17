import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_FAIL, REGISTER_SUCESS, SET_ALERT } from '../actions/types';

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });
  console.log(name, email, password);

  try {
    // login axios call
    const res = await axios.post('/api/users', body, config);

    // if successful call this dispatch
    dispatch({
      type: REGISTER_SUCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.error;

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
