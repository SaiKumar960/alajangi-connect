const mongoose = require('mongoose');

module.exports = async (req, res) => {
  // Try to connect if not connected
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'DB Connection Failed', details: err.message });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Direct API Health Check 🚀',
    db: 'connected'
  });
};
