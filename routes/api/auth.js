const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/Users');

// @route   GET api/auth
// @desc    Test route
// @access  Public

// auth is the middleware
router.get('/', auth, async (req, res) => {
  try {
    // req.user is coming from the middleware
    // select -password will remove the password from being returned
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
