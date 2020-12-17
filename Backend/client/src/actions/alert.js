import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// This can dispatch more then one action type from a function
// This is what THUNK package is used for; adding the extra arrow ex. => (dispatch)
// timeout = 5000 sets default value for timeout to 5000 unless it is passed in
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  console.log('IN SETALERT() ACTION');
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  // after 5 seconds dispatch REMOVE_ALERT from the reducer which will filter this alert and remove it from state
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
