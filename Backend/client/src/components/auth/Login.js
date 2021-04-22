import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { login } from '../../actions/auth';
import auth from '../../reducers/auth';

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    // converts object or value to JSON string
    const { email, password } = formData;
    props.login(email, password);
  };

  // Redirect if logged in
  if (props.isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Sign into your account
      </p>
      <form
        action='dashboard.html'
        className='form'
        onSubmit={(e) => onSubmit(e)}
      >
        <div className='form-group'>
          <input
            type='email'
            placeholder='email'
            name='email'
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Dont have an account? <Link to='/register'>Sign up</Link>
      </p>
    </>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// null map state to props
// actions: login
export default connect(mapStateToProps, { login, setAlert })(Login);
