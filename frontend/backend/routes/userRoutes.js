const express = require('express');
const router = express.Router();
const { getUserProfile, getUserPosts, updateProfile, toggleFollow, searchUsers, getSuggestedUsers, getSavedPosts } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestedUsers);
router.get('/me/saved', protect, getSavedPosts);

router.get('/:id', protect, getUserProfile);
router.get('/:id/posts', protect, getUserPosts);
router.put('/me', protect, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateProfile);
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;
