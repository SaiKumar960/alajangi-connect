const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!global.dbConnected) {
      const mockId = 'mock_user_' + Date.now();
      const token = generateToken(mockId);
      return res.status(201).json({
        success: true,
        message: 'Account created (Mock Mode)',
        token,
        user: { _id: mockId, name, email, avatar: 'https://i.pravatar.cc/150?u=' + mockId, bio: 'Mock Profile', createdAt: new Date() },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    let avatar = undefined;
    let avatarPublicId = undefined;

    if (req.file) {
      avatar = req.file.path;        // Cloudinary URL
      avatarPublicId = req.file.filename; // Cloudinary public_id
    }

    const user = await User.create({ name, email, password, avatar, avatarPublicId });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!global.dbConnected) {
      const mockId = 'mock_user_123';
      const token = generateToken(mockId);
      return res.status(200).json({
        success: true,
        message: 'Logged in (Mock Mode)',
        token,
        user: { _id: mockId, name: 'Mock User', email, avatar: 'https://i.pravatar.cc/150?u=mock', bio: 'This is a mock account because the database is offline.', createdAt: new Date() },
      });
    }

    // Explicitly select password (excluded by default via schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
