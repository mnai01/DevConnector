// test1@test.com
// test1234

import React, { useEffect } from 'react';
import './scss/style.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import { Landing } from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layouts/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
// Redux
// this connects react and redux
import { Provider } from 'react-redux';
// Our own redux store
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    // Since store is already imported here no need to use connect at the bottom
    store.dispatch(loadUser());
  }, []);
  return (
    // Gives all the components below in the hierarchy access to app lvl state
    <Provider store={store}>
      <Router>
        <>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            {/* Switch can only have routes in it so we put alert above it */}
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/dashboard' component={Dashboard} />
            </Switch>
          </section>
        </>
      </Router>
    </Provider>
  );
};

export default App;
