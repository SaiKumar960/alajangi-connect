const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

/**
 * @desc    Send OTP for registration
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOtp = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide an email or phone number' });
    }

    const lowerIdentifier = identifier.toLowerCase();
    const existingUser = await User.findOne({ 
      $or: [{ email: lowerIdentifier }, { phone: identifier }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Account already exists with this identifier' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`\n================================`);
    console.log(`🚀 MOCK OTP for ${identifier}: ${otp}`);
    console.log(`================================\n`);

    await Otp.findOneAndUpdate(
      { identifier: lowerIdentifier },
      { otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    const identifier = (email || phone).toLowerCase();
    const otpRecord = await Otp.findOne({ identifier, otp });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const existingUser = await User.findOne({ 
      $or: email && phone ? [{ email: email.toLowerCase() }, { phone }] : email ? [{ email: email.toLowerCase() }] : [{ phone }] 
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with these details already exists' });
    }

    let avatar = undefined;
    let avatarPublicId = undefined;

    if (req.file) {
      avatar = req.file.path;
      avatarPublicId = req.file.filename;
    }

    const user = await User.create({ name, email: email ? email.toLowerCase() : undefined, phone, password, avatar, avatarPublicId });
    await Otp.deleteOne({ _id: otpRecord._id });
    
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
    const { identifier, password } = req.body;

    const user = await User.findOne({ 
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }] 
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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

module.exports = { register, login, getMe, sendOtp };
