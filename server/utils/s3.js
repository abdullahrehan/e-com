const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const sharp = require('sharp');

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
const uploadFileToS3 = async (file) => {
  try {
    // Base file name with timestamp to ensure uniqueness
    const baseFileName = `${Date.now()}-${path.basename(file.originalname, path.extname(file.originalname))}`;
    const fileExtension = path.extname(file.originalname);

    // 1. Process the original image (no transformation, just upload as-is)
    const originalFileName = `${baseFileName}${fileExtension}`;
    const originalParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `profile-images/original/${originalFileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // 2. Create a thumbnail (resize to 150x150, for example)
    const thumbnailBuffer = await sharp(file.buffer)
      .resize({ width: 150, height: 150, fit: 'cover' })
      .toBuffer();
    const thumbnailFileName = `${baseFileName}-thumbnail${fileExtension}`;
    const thumbnailParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `profile-images/thumbnail/${thumbnailFileName}`,
      Body: thumbnailBuffer,
      ContentType: file.mimetype,
    };

    // 3. Create a blurred (hashed) version (low quality, blurred for loading placeholder)
    const blurredBuffer = await sharp(file.buffer)
      .resize({ width: 50, height: 50, fit: 'cover' }) // Low resolution
      .blur(10) // Apply blur effect
      .toBuffer();
    const blurredFileName = `${baseFileName}-blurred${fileExtension}`;
    const blurredParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `profile-images/blurred/${blurredFileName}`,
      Body: blurredBuffer,
      ContentType: file.mimetype,
    };

    // Upload all three versions to S3
    await Promise.all([
      s3Client.send(new PutObjectCommand(originalParams)),
      s3Client.send(new PutObjectCommand(thumbnailParams)),
      s3Client.send(new PutObjectCommand(blurredParams)),
    ]);

    // Generate URLs for all three versions
    const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profile-images`;
    const urls = {
      original: `${baseUrl}/original/${originalFileName}`,
      thumbnail: `${baseUrl}/thumbnail/${thumbnailFileName}`,
      blurred: `${baseUrl}/blurred/${blurredFileName}`,
    };

    return urls; // Return an object with all three URLs
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

module.exports = { uploadFileToS3 };