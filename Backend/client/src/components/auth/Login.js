import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(formData);
    try {
      const res = await axios.post('/api/auth', body, config);
      console.log(res);
    } catch (err) {
      console.log(err.response.data);
    }
  };

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
