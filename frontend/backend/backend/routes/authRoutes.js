const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/register', upload.single('avatar'), validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
