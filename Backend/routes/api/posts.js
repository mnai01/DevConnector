const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const {
  createPost,
  getPosts,
  getPostById,
  deletePostById,
  likePost,
  unlike,
  comment,
  deleteComment,
} = require("../../controllers/postController");

router.post(
  "/",
  [auth, check("text", "Text is required").not().isEmpty()],
  createPost
);
router.get("/", auth, getPosts);
router.get("/:id", auth, getPostById);
router.delete("/:id", auth, deletePostById);
router.put("/like/:id", auth, likePost);
router.put("/unlike/:id", auth, unlike);
router.post(
  "/comment/:id",
  [auth, check("text", "Text is required").not().isEmpty()],
  comment
);
router.delete("/comment/:id/:comment_id", auth, deleteComment);

module.exports = router;
