const User = require('../models/User');
const Post = require('../models/Post');
const { cloudinary } = require('../config/cloudinary');
const memoryStore = require('../utils/memoryStore');

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      const user = await memoryStore.findUserById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, user: { ...user, postsCount: 0, followersCount: 0, followingCount: 0, isFollowing: false } });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const postsCount = await Post.countDocuments({ author: user._id });
    const isFollowing = user.followers.some(f => f._id.toString() === req.user._id.toString());

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        postsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        followers: user.followers,
        following: user.following,
        isFollowing,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Follow / Unfollow user
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
const toggleFollow = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    if (global.useMemoryDb) {
      // Memory store doesn't handle follows yet in this simple mock, just return success
      return res.status(200).json({ success: true, isFollowing: true, followersCount: 1 });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search users by name
 * @route   GET /api/users/search?q=...
 * @access  Private
 */
const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(200).json({ success: true, users: [] });

    if (global.useMemoryDb) {
      const users = await memoryStore.searchUsers(req.query.q);
      return res.status(200).json({ success: true, users });
    }

    const regex = new RegExp(query, 'i');
    const users = await User.find({ name: regex }).select('name avatar bio').limit(10);
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get suggested users to follow
 * @route   GET /api/users/suggestions
 * @access  Private
 */
const getSuggestedUsers = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      const suggested = memoryStore.users.slice(0, 5).map(u => ({ _id: u._id, name: u.name, avatar: u.avatar, bio: u.bio }));
      return res.status(200).json({ success: true, users: suggested });
    }

    const currentUser = await User.findById(req.user._id);
    const excludedIds = [...currentUser.following, currentUser._id];

    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $nin: excludedIds } } },
      { $sample: { size: 5 } },
      { $project: { name: 1, avatar: 1, bio: 1 } }
    ]);

    res.status(200).json({ success: true, users: suggestedUsers });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get posts by a specific user
 * @route   GET /api/users/:id/posts?page=1
 * @access  Private
 */
const getUserPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(30, parseInt(req.query.limit) || 12);

    if (global.useMemoryDb) {
      const userPosts = memoryStore.posts.filter(p => p.author._id === req.params.id || p.author === req.params.id);
      return res.status(200).json({ success: true, posts: userPosts, pagination: { page, limit, total: userPosts.length, hasMore: false } });
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar'),
      Post.countDocuments({ author: req.params.id }),
    ]);

    const userId = req.user._id.toString();
    const enriched = posts.map((p) => ({
      ...p.toObject(),
      isLiked: p.likes.some((id) => id.toString() === userId),
      likesCount: p.likes.length,
    }));

    res.status(200).json({
      success: true,
      posts: enriched,
      pagination: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user's profile (name, bio, avatar)
 * @route   PUT /api/users/me
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.bio !== undefined) updates.bio = req.body.bio.trim();

    if (global.useMemoryDb) {
      return res.status(200).json({ success: true, user: { ...req.user, ...updates } });
    }

    const existingUser = await User.findById(req.user._id);
    if (req.file && existingUser.avatarPublicId) {
      await cloudinary.uploader.destroy(existingUser.avatarPublicId);
    }

    if (req.file) {
      updates.avatar = req.file.path;
      updates.avatarPublicId = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, getUserPosts, updateProfile, toggleFollow, searchUsers, getSuggestedUsers };
