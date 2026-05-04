const Trend = require('../models/Trend');

// Get top trending tags
exports.getTrendingTags = async (req, res) => {
  try {
    const trends = await Trend.find()
      .sort({ count: -1, lastUsed: -1 })
      .limit(10);

    res.json({
      success: true,
      trends: trends.map(t => ({
        tag: t.tag,
        count: t.count,
        score: Math.min(100, Math.floor((t.count / (trends[0]?.count || 1)) * 100)) // Normalize score for UI bars
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Internal helper to update trends from post content
exports.updateTrends = async (content, postId) => {
  try {
    const hashtagRegex = /#[\w\u0080-\uFFFF]+/g;
    const tags = content.match(hashtagRegex) || [];
    
    const uniqueTags = [...new Set(tags.map(t => t.toLowerCase()))];

    for (const tag of uniqueTags) {
      await Trend.findOneAndUpdate(
        { tag },
        { 
          $inc: { count: 1 },
          $set: { lastUsed: Date.now() },
          $addToSet: { posts: postId }
        },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error('Trend Update Error:', err);
  }
};
