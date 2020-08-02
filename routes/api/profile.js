const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profiles');
const User = require('../../models/Users');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private

// using async because we are using mongoose which returns a promise
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id comes from the middleware if the authentication is successful
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
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
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    console.log('hi' + req.user);

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
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    // returns all profiles with the users name/avatar attached.
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    // find one profile that matches the user id in the parameters of the endpoint
    // return the profile data with the users name/avatar
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Kind error Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
