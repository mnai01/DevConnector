const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");

const auth = require("../middleware/auth");
const User = require("../models/Users");

// @route   GET api/auth
// @desc    Test route
// @access  Public
exports.testAuth = asyncHandler(async (req, res) => {
  try {
    // req.user is coming from the middleware
    // select -password will remove the password from being returned
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
exports.loginAuth = asyncHandler(async (req, res) => {
  // takes the users req and checks it with validationResult function
  // if any of the data doesnt match the specifed rules above "const errors" will contain error data
  const errors = validationResult(req);
  // if errors is not empty
  if (!errors.isEmpty()) {
    console.log("ERROR AUTHENTICATING LOGIN");
    // return a 400 status and json object of the errors.array which contains the messages
    return res.status(400).json({ errors: errors.array() });
  }

  // pulls out specifed data from parameters
  const { email, password } = req.body;

  // findOne gives a promise back, we could use .then() to handle it
  // but instead we will use async await
  try {
    // if found it will return a user + their information
    let user = await User.findOne({ email });

    // check to see if there is not a user, if not send back an error
    if (!user) {
      // the reason we use return {errors:[{msg: 'Invalid Credentials'}]}
      // is because in our other error we are also returning an array of errors,
      // and within that array it has a msg variable, so we are recreating that
      // I think this will help will the frontend side when dealing with reponses
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

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
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }

  console.log("SUCESSFULLY REGISTERED USER");
  console.log(req.body);
});
