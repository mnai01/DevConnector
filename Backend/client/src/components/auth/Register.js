import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = (props) => {
  const [formData, setFormdata] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;
  const onChange = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // if passwords both blank you get error
    // SOLUTION  || password == '' || password2 == ''
    if (password !== password2) {
      props.setAlert('password do not match', 'danger', 3000);
    } else {
      props.register({ name, email, password });
      // const newUser = {
      //   name,
      //   email,
      //   password,
      // };
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   };
      //   const body = JSON.stringify(newUser);
      //   const res = await axios.post('/api/users', body, config);
      //   console.log(res.data);
      // } catch (err) {
      //   console.log(err.response.data);
      // }
    }
  };

  // Redirect if logged in
  if (props.isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <>
      <h1 className='large text-primary'>Sign up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Create your account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='name'
            name='name'
            value={name}
            onChange={(e) => {
              onChange(e);
            }}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='email'
            name='email'
            value={email}
            onChange={(e) => {
              onChange(e);
            }}
          />
          <small className='form-text'>
            This site uses gravitar so use your gravitar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => {
              onChange(e);
            }}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => {
              onChange(e);
            }}
          />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Already have an account?<Link to='/login'>Sign in</Link>
      </p>
    </>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
// This will allow us to access props.setAlert
// connect() takes in 2 things
// 1st any state you wanna map (like getting state from profile)
// 2nd an object with the action you want to use, this gets passed into the component via props
export default connect(mapStateToProps, { setAlert, register })(Register);
