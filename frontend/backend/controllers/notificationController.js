const Notification = require('../models/Notification');

// Get all notifications for logged in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar')
      .populate('post', 'content');

    res.json({
      status: 'success',
      data: { notifications }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark all notifications as read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Internal helper to create a notification
exports.createNotification = async (recipientId, senderId, type, postId = null) => {
  try {
    // Don't notify if user is interacting with their own content
    if (recipientId.toString() === senderId.toString()) return;

    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId
    });
    
    // In a full socket implementation, we would emit here
  } catch (err) {
    console.error('Notification Creation Error:', err);
  }
};
