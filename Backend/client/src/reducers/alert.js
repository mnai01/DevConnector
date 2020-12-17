import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
// Holds all the alerts
const initialState = [];

export default function (state = initialState, action) {
  console.log('IN ALERT REDUCER');

  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      // return array of alerts with the new alert added
      return [...state, payload];
    case REMOVE_ALERT:
      // Filter through alerts, if alert in state is not equal to alert passed in then return it
      // else if alert does match payload dont return it (THIS IS HOW ITS BEING REMOVED)
      // Return all alerts except the one that matches the payload
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
