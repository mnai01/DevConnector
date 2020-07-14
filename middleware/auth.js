const jwt = require('jsonwebtoken');
const config = require('config');

// next is a callback we have to run to once we are done so it moves on to the next piece of middleware
module.exports = function (req, res, next) {
  // Get Token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // verify takes in the token and also the secret word for decoding
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not found' });
  }
};
