const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// User Model
const User = require('../../models/Users');

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
  async (req, res) => {
    // takes the users req and checks it with validationResult function
    // if any of the data doesnt match the specifed rules above "const errors" will contain error data
    const errors = validationResult(req);
    // if errors is not empty
    if (!errors.isEmpty()) {
      console.log('ERROR VALIDATING USER REGISTRATION');
      // return a 400 status and json object of the errors.array which contains the messages
      return res.status(400).json({ errors: errors.array() });
    }

    // pulls out specifed data from parameters
    const { name, email, password } = req.body;

    // findOne gives a promise back, we could use .then() to handle it
    // but instead we will use async await
    try {
      let user = await User.findOne({ email });

      if (user) {
        // the reason we use return {errors:[{msg: 'User already exists'}]} in the
        // is because in our other error we are also returning an array of errors,
        // and within that array it has a msg variable, so we are recreating that
        // I think this will help will the frontend side when dealing with reponses
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        // size of image
        s: '200',
        // rating, pg for no explicit images
        r: 'pg',
        // default image
        d: 'mm',
      });

      // create an instance of the new registered user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // a salt is random data that is used as an additional input to a one-way function that hashes data
      const salt = await bcrypt.genSalt(10);

      // this will create a hash and put it into the user password
      // user.password referes to the password in the user object above
      user.password = await bcrypt.hash(password, salt);

      // saved it to the database
      await user.save();

      const payload = {
        user: { id: user.id },
      };
      // FIRST parameter, is the data that is used to create the JWT
      // in this case we use the user id because the ID is a unique identifier
      // so to pull all the users info all we need is the ID which is why
      // thats the only information we put into the token

      // SECOND parameter(used config for security)
      // used in the algorithm to create an encrypted key aka the Json web token
      // secretOrPrivateKey is a string, buffer, or object containing either the secret for HMAC algorithms or the PEM
      //encoded private key for RSA and ECDSA
      // THIRD parameter OPTIONAL, when the JWT expires in seconds
      // Fourth parameter call back function (asynchronous)
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

    console.log('SUCESSFULLY REGISTERED USER');
    console.log(req.body);
  }
);

module.exports = router;
