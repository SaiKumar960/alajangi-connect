const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,          // suitable for 5k–7k concurrent users
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    global.useMemoryDb = false;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️ SWITCHING TO IN-MEMORY DATABASE FOR ALPHA TESTING');
    global.useMemoryDb = true;
  }
};

module.exports = connectDB;
