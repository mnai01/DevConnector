const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");
const Post = require("../models/Posts");
const Profile = require("../models/Profiles");
const User = require("../models/Users");
const c = require("config");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
exports.getPosts = asyncHandler(async (req, res) => {
  try {
    // sort by default returns oldest first, -1 makes the most recent returned first
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
exports.getPostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    // if id given id not a valid valid id object
    // for example if the id can only consist of 7 numbers 8274657
    // then an id with 8 numbers is not a valid ObjectId*
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
exports.deletePostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // Check user
    // If users id stored locally does not match the does not match the users token
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" });
    }

    await post.remove();
    res.json("Post Removed");
  } catch (err) {
    // if id given id not a valid valid id object
    // for example if the id can only consist of 7 numbers 8274657
    // then an id with 8 numbers is not a valid ObjectId*
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post by ID
// @access  Private
exports.likePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post has already been liked by this user
    // Filter is a highOrder Array method
    // Filter will only return things that match the function definition within the filter method
    // if Filter length is greater then 0 it means a match was found and that user already liked it
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    // add like to like array, we could use push() but unshift() adds it to the beginning
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Like a post by ID
// @access  Private
exports.unlike = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post has not already been liked by this user
    // Filter is a highOrder Array method
    // Filter will only return things that match the function definition within the filter method
    // if Filter length is greater then 0 it means a match was found and that user already liked it
    // Filter function return all the objects that match the function condition, so if the length of
    // filter == 0 then nothing was found, if its more then 0 then a result was found (as in that user has liked it)
    // https://stackoverflow.com/questions/56812010/why-does-this-filter-function-undefined-with-the-curly-brackets-but-not-without
    console.log(
      post.likes.filter((like) => like.user.toString() === req.user.id)
    );
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Get remove index
    // maps each like in post and find indexOf the current user
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    // removed desirex index from array
    // 1 means that one item is removed
    post.likes.splice(removeIndex, 1);
    console.log(removeIndex + " Removed");

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/coment/:id
// @desc    Comment on a post
// @access  Private
exports.comment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);
    const newComment = {
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    };

    post.comments.unshift(newComment);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/:posts/:comment/
// @desc    Delete comment
// @access  Private
exports.deleteComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // find() method returns the first value that matches from the collection.
    // filter() method returns the matched values in an array from the collection (returns an array)
    const comment = post.comments.find((comment) => {
      matchedComment = comment.id == req.params.comment_id;
      return matchedComment;
    });

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    const user = await User.findById(req.user.id);

    if (req.user.id !== comment.user.toString()) {
      return res.status(404).json({ msg: "User Not authorized" });
    }

    const removeIndex = post.comments
      .map((comment) => comment.id.toString())
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);
    console.log(removeIndex + " Removed");

    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
