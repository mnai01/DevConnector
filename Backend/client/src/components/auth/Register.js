import React, { useState } from 'react';
import axios from 'axios';

export const Register = () => {
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
      console.log('password do not match');
    } else {
      const newUser = {
        name,
        email,
        password,
      };
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const body = JSON.stringify(newUser);
        const res = await axios.post('/api/users', body, config);
        console.log(res.data);
      } catch (err) {
        console.log(err.response.data);
      }
    }
  };

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
            required
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
            minLength='6'
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
        Already have an account?<a href='login.html'>Sign in</a>
      </p>
    </>
  );
};
