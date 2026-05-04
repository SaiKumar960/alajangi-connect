const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getPostById,
  toggleLike,
  deletePost,
  editPost,
  toggleSave,
} = require('../controllers/postController');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validatePost, validateComment } = require('../middleware/validate');
const { upload } = require('../config/cloudinary');

// Feed & single post
router.get('/', protect, getFeed);
router.get('/:id', protect, getPostById);

// Create, edit & delete post (image upload optional on create)
router.post('/', protect, upload.single('image'), validatePost, createPost);
router.put('/:id', protect, validatePost, editPost);
router.delete('/:id', protect, deletePost);

// Like toggle
router.post('/:id/like', protect, toggleLike);

// Save/Bookmark toggle
router.post('/:id/save', protect, toggleSave);

// Comments
router.post('/:id/comment', protect, validateComment, addComment);
router.get('/:id/comments', protect, getComments);
router.delete('/:postId/comments/:commentId', protect, deleteComment);

module.exports = router;
