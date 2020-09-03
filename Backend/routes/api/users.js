const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const { registerUser } = require("../../controllers/usersController");

// User Model
const User = require("../../models/Users");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post("/", [
  // checks to make sure its is not empty
  check("name", "Name is required").not().isEmpty(),
  // checks to make sure its an email
  check("email", "Email is required").isEmail(),
  // checks to make sure it contains min characters
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
]);

module.exports = router;
