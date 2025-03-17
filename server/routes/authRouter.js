const express = require('express');
const router = express.Router();
const { createUser,loginUser,verifyEmail,forgotPassword,resetPassword,verifyResetCode } = require('../controllers/authController');

// Authentication Routes
router.post('/auth/signin', createUser);
router.post('/auth/login', loginUser);
router.post('/auth/verify-email', verifyEmail);
router.post('/auth/forgot-password', forgotPassword);
router.patch('/auth/reset-password', resetPassword);
router.post('/auth/verify-reset-password', verifyResetCode);

module.exports = router;
