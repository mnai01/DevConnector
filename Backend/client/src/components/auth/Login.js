import React, { useState } from 'react';

export const Login = () => {
  return (
    <>
      {/* <!-- Alert --> */}
      <div class='alert alert-danger'>Invalid Credentals</div>
      <h1 class='large text-primary'>Sign In</h1>
      <p class='lead'>
        <i class='fas fa-user'></i>Sign into your account
      </p>
      <form action='dashboard.html' class='form'>
        <div class='form-group'>
          <input type='email' placeholder='email' />
        </div>
        <div class='form-group'>
          <input type='password' placeholder='Password' />
        </div>
        <input type='submit' value='Login' class='btn btn-primary' />
      </form>
      <p class='my-1'>
        Dont have an account? <a href='register.html'>Sign up</a>
      </p>
    </>
  );
};
