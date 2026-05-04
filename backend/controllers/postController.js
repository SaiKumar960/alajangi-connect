const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    const postData = { author: req.user._id, text };

    // If a file was uploaded, store the Cloudinary URL
    if (req.file) {
      postData.imageUrl = req.file.path;          // Cloudinary URL
      postData.imagePublicId = req.file.filename; // Cloudinary public_id
    }

    const post = await Post.create(postData);
    await post.populate('author', 'name avatar');

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated feed
 * @route   GET /api/posts?page=1&limit=10
 * @access  Private
 */
const getFeed = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const filter = req.query.filter; // 'following' or undefined
    const skip = (page - 1) * limit;

    // Build query filter
    let query = {};
    if (filter === 'following') {
      const currentUser = await User.findById(req.user._id).select('following');
      query = { author: { $in: currentUser.following } };
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar'),
      Post.countDocuments(query),
    ]);

    // Attach isLiked + isSaved flags
    const userId = req.user._id.toString();
    const savedSet = new Set(
      (req.user.savedPosts || []).map((id) => id.toString())
    );
    const enriched = posts.map((p) => ({
      ...p.toObject(),
      isLiked: p.likes.some((id) => id.toString() === userId),
      likesCount: p.likes.length,
      isSaved: savedSet.has(p._id.toString()),
    }));

    res.status(200).json({
      success: true,
      posts: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Private
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    const userId = req.user._id.toString();
    res.status(200).json({
      success: true,
      post: {
        ...post.toObject(),
        isLiked: post.likes.some((id) => id.toString() === userId),
        likesCount: post.likes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const { createNotification } = require('./notificationController');

/**
 * @desc    Like or unlike a post (toggle)
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
      // Trigger notification
      await createNotification(post.author, userId, 'like', post._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      isLiked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a post (author only)
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    // Delete image from Cloudinary if present
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await Promise.all([
      post.deleteOne(),
      Comment.deleteMany({ post: post._id }),
    ]);

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit a post (author only)
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const editPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    post.text = req.body.text;
    await post.save();
    await post.populate('author', 'name avatar');

    res.status(200).json({ success: true, post: post.toObject() });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle save/bookmark a post
 * @route   POST /api/posts/:id/save
 * @access  Private
 */
const toggleSave = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedPosts.some((id) => id.toString() === postId);

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !alreadySaved,
      savedCount: user.savedPosts.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getFeed, getPostById, toggleLike, deletePost, editPost, toggleSave };
