const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const asyncHandler = require("../middleware/asyncHandler");

const { validationResult } = require("express-validator");

const Profile = require("../models/Profiles");
const User = require("../models/Users");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private

// using async because we are using mongoose which returns a promise
exports.getProfile = asyncHandler(async (req, res) => {
  try {
    // req.user.id comes from the middleware if the authentication is successful
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
exports.createProfile = asyncHandler(async (req, res) => {
  // Check for body error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // pull all information out of body
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  // Build profile object to insert into db
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  // seperate each entry with comma then trim the white space
  if (skills)
    profileFields.skills = skills.split(",").map((skill) => skill.trim());

  // Build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  try {
    // look for profile by user
    let profile = await Profile.findOne({ user: req.user.id });

    // if profile found updated it
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        // filter method
        { user: req.user.id },
        // field/data to be updated
        // ex. { $set: { name: "Naomi" } }
        { $set: profileFields },
        // The default is to return the original, unaltered document
        // set new:true for the updated document to be returned
        { new: true }
      );
      return res.json(profile);
    }

    // else if profile not create, then creat new profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
exports.getAllProfiles = asyncHandler(async (req, res) => {
  try {
    // returns all profiles with the users name/avatar attached.
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/user_id
// @desc    Get profile by user ID
// @access  Public
exports.getUserByID = asyncHandler(async (req, res) => {
  try {
    // find one profile that matches the user id in the parameters of the endpoint
    // return the profile data with the users name/avatar
    // use QUERY method is you were filting the results ex.(www.api.com/?user_id=dsdfdfds)
    // use the body method as seem below for everything else
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Kind error Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profiles, user, posts
// @access  Private
exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    // @todo - remove users posts
    // Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // Remove user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Can be a post request
// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
exports.addProfile = asyncHandler(async (req, res) => {
  // Check for body error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // pull all information out of body
  const { title, company, location, from, to, current, description } = req.body;

  const newExperience = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // profile.experience is an array so this .unshift is similar to push
    // except it pushes it onto the first entry
    profile.experience.unshift(newExperience);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Can be a put request
// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile experience
// @access  Private
exports.deleteExperience = asyncHandler(async (req, res) => {
  try {
    // get the whole user profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Get the index of the experience we want to remove
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    // replace 1 element at index "removeIndex" with whatever is in the 3rd param
    // In this case the 3rd param is empty so it will just delete it
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// Can be a post request
// @route   PUT api/profile/education/:exp_id
// @desc    update profile experience
// @access  Private
exports.addEducation = asyncHandler(async (req, res) => {
  // Check for body error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // pull all information out of body
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  const newEducation = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // profile.experience is an array so this .unshift is similar to push
    // except it pushes it onto the first entry
    profile.education.unshift(newEducation);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Can be a put request
// @route   DELETE api/profile/education/:edu_id
// @desc    Delete profile education
// @access  Private
exports.deleteExperience = asyncHandler(async (req, res) => {
  try {
    // get the whole user profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Get the index of the experience we want to remove
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    // replace 1 element at index "removeIndex" with whatever is in the 3rd param
    // In this case the 3rd param is empty so it will just delete it
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/github/:username
// @desc    GET profile experience
// @access  Public
exports.getGithub = asyncHandler(async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_Secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github profile found" });
      }
      // the body comes as a regular string so we need to parse it
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});
