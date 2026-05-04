const express = require('express');
const router = express.Router();
const { register, login, getMe, sendOtp } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/send-otp', sendOtp);
router.post('/register', upload.single('avatar'), validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
