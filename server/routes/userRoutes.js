const express = require('express');
const router = express.Router();
const { uploadProfileImage } = require('../controllers/userController');
const upload = require('../middleware/multer');
const authenticateUser = require('../middleware/auth');
 

// Authentication Routes
router.post('/user/upload-image',authenticateUser,upload.single('image'), uploadProfileImage);

module.exports = router;
 