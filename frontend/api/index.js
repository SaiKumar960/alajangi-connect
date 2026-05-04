/**
 * Vercel Serverless Function entry point.
 * This is a lightweight Express app that re-uses the backend routes
 * without Socket.IO or http.createServer (which don't work in serverless).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ─── Database (lazy singleton) ───────────────────────────────────────────────
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected (serverless)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://alajangi-connect.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to DB before handling any request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
const authRoutes = require('../backend/routes/authRoutes');
const postRoutes = require('../backend/routes/postRoutes');
const userRoutes = require('../backend/routes/userRoutes');
const notificationRoutes = require('../backend/routes/notificationRoutes');
const { errorHandler, notFound } = require('../backend/middleware/errorMiddleware');

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Alajangi Connect API v1.2 🚀',
    db: isConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
