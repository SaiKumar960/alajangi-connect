const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Post text is required'],
      maxlength: [2000, 'Post cannot exceed 2000 characters'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    // Embedded likes: fast reads for MVP scale
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for efficient feed queries (newest first, by author)
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
