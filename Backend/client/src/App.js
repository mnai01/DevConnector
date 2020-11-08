import React from 'react';
import './scss/style.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar } from './components/layouts/Navbar';
import { Landing } from './components/layouts/Landing';
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';
// Redux
// this connects react and redux
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </>
      </Router>
    </Provider>
  );
}

export default App;
