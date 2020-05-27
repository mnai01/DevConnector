const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    // checks to make sure its is not empty
    check('name', 'Name is required').not().isEmpty(),
    // checks to make sure its an email
    check('email', 'Email is required').isEmail(),
    // checks to make sure it contains min characters
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    // takes the users req and checks it with validationResult function
    // if any of the data doesnt match the specifed rules above "const errors" will contain error data
    const errors = validationResult(req);
    // if errors is not empty
    if (!errors.isEmpty()) {
      console.log('ERROR VALIDATING USER REGISTRATION');
      // return a 400 status and json object of the errors.array which contains the messages
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('SUCESSFULLY REGISTERED USER');
    console.log(req.body);
    res.send('User route');
  }
);

module.exports = router;
