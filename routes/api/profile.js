const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const {
  getProfile,
  createProfile,
  getAllProfiles,
  getUserByID,
  deleteUser,
  addProfile,
  deleteExperience,
  addEducation,
  getGithub,
} = require("../../controllers/profileController");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, getProfile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty(),
  ],
  createProfile
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/", getAllProfiles);

// @route   GET api/profile/user/user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", getUserByID);

// @route   DELETE api/profile
// @desc    Delete profiles, user, posts
// @access  Private
router.delete("/", auth, deleteUser);

// Can be a post request
// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("company", "company is required").not().isEmpty(),
    check("from", "from is required").not().isEmpty(),
  ],
  addProfile
);

// Can be a put request
// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile experience
// @access  Private
router.delete("/experience/:exp_id", auth, deleteExperience);

// Can be a post request
// @route   PUT api/profile/education/:exp_id
// @desc    update profile experience
// @access  Private
router.put(
  "/education",
  [
    auth,
    check("school", "School is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("fieldofstudy", "field of study is required").not().isEmpty(),
    check("from", "from is required").not().isEmpty(),
  ],
  addEducation
);

// Can be a put request
// @route   DELETE api/profile/education/:edu_id
// @desc    Delete profile education
// @access  Private
router.delete("/education/:edu_id", auth);

// @route   GET api/profile/github/:username
// @desc    GET profile experience
// @access  Public
router.get("/github/:username", getGithub);

module.exports = router;
