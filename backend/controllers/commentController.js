const Comment = require('../models/Comment');
const Post = require('../models/Post');
const memoryStore = require('../utils/memoryStore');

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:id/comment
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    if (global.useMemoryDb) {
      const comment = await memoryStore.addComment({
        post: req.params.id,
        author: { _id: req.user._id, name: req.user.name, avatar: req.user.avatar },
        text: req.body.text
      });
      return res.status(201).json({ success: true, comment });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      text: req.body.text,
    });

    // Increment counter on the post (avoids expensive COUNT queries)
    await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });

    await comment.populate('author', 'name avatar');

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for a post (paginated)
 * @route   GET /api/posts/:id/comments?page=1
 * @access  Private
 */
const getComments = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);

    if (global.useMemoryDb) {
      // Memory store doesn't track comments separately by post ID in this simple implementation
      // but we can filter if needed. For now just return empty or mock.
      return res.status(200).json({ success: true, comments: [], pagination: { page, limit, total: 0, hasMore: false } });
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ post: req.params.id })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar'),
      Comment.countDocuments({ post: req.params.id }),
    ]);

    res.status(200).json({
      success: true,
      comments,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment (author only)
 * @route   DELETE /api/posts/:postId/comments/:commentId
 * @access  Private
 */
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Promise.all([
      comment.deleteOne(),
      Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } }),
    ]);

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments, deleteComment };
