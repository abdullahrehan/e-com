const { User } = require('../models/index');
const { uploadFileToS3 } = require('../utils/s3');
const upload = require('../middleware/multer');

const uploadProfileImage = async (req, res) => {
  try {
    const user = req.user;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'No image file provided',
        data: {},
      });
    }

    // Upload the file to S3 (returns an object with original, thumbnail, and blurred URLs)
    const imageUrls = await uploadFileToS3(req.file);

    // Update the user's profile with all three image URLs
    user.profilePicture = {
      original: imageUrls.original,
      thumbnail: imageUrls.thumbnail,
      blurred: imageUrls.blurred,
    };
    await user.save();

    console.log(`Profile image uploaded for user: ${user.email}`);
    return res.status(200).json({
      status: true,
      message: 'Profile image uploaded successfully',
      data: {
        profilePicture: {
          original: imageUrls.original,
          thumbnail: imageUrls.thumbnail,
          blurred: imageUrls.blurred,
        },
      },
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {},
    });
  }
};

module.exports = { uploadProfileImage };