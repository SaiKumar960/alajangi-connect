const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("NO MONGO_URI FOUND IN ENV!");
        process.exit(1);
    }
    console.log("Connecting to:", uri.replace(/:([^:@]{3,})@/, ':***@'));
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("SUCCESS: Connected to MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

testConnection();
