const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const { testAuth, loginAuth } = require("../../controllers/authController");

const auth = require("../../middleware/auth");
const User = require("../../models/Users");

// @route   GET api/auth
// @desc    Test route
// @access  Public

// auth is the middleware
router.get("/", auth, testAuth);

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/",
  [
    // checks to make sure its an email
    check("email", "Email is required").isEmail(),
    // checks to make sure password exists
    check("password", "Password is required").exists(),
  ],
  loginAuth
);

module.exports = router;
