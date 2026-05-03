const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getPostById,
  toggleLike,
  deletePost,
} = require('../controllers/postController');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validatePost, validateComment } = require('../middleware/validate');
const { upload } = require('../config/cloudinary');

// Feed & single post
router.get('/', protect, getFeed);
router.get('/:id', protect, getPostById);

// Create & delete post (image upload optional)
router.post('/', protect, upload.single('image'), validatePost, createPost);
router.delete('/:id', protect, deletePost);

// Like toggle
router.post('/:id/like', protect, toggleLike);

// Comments
router.post('/:id/comment', protect, validateComment, addComment);
router.get('/:id/comments', protect, getComments);
router.delete('/:postId/comments/:commentId', protect, deleteComment);

module.exports = router;
