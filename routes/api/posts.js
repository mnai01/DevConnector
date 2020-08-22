const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const {
  createPost,
  getPosts,
  getPostById,
  deletePostById,
  likePost,
} = require('../../controllers/postController');

// @route   GET api/Post
// @desc    Test route
// @access  Public
router.post(
  '/',
  [auth, check('text', 'Text is required').not().isEmpty()],
  createPost
);
router.get('/', auth, getPosts);
router.get('/:id', auth, getPostById);
router.delete('/:id', auth, deletePostById);
router.put('/like/:id', auth, likePost);
module.exports = router;
