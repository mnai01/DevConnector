import axios from 'axios';
import { setAlert } from '../actions/alert';

const setAuthToken = (token) => {
  if (token) {
    // adds global header to axios
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // delete from global headers
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
