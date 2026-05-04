const { body, validationResult } = require('express-validator');

/**
 * Run validation and return 400 if any errors exist
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body()
    .custom((value, { req }) => {
      if (!req.body.email && !req.body.phone) {
        throw new Error('Please provide either an email or a phone number');
      }
      return true;
    }),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('otp')
    .notEmpty().withMessage('OTP is required'),
  handleValidationErrors,
];

const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Email or Phone is required'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validatePost = [
  body('text')
    .trim()
    .notEmpty().withMessage('Post text is required')
    .isLength({ max: 2000 }).withMessage('Post cannot exceed 2000 characters'),
  handleValidationErrors,
];

const validateComment = [
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validatePost, validateComment };
