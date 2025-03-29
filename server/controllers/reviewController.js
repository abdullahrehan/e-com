// controllers/ReviewController.js
const mongoose = require('mongoose');
const { Review, User, Product } = require('../models/index'); // Adjust path as per your project structure

// Create Review
const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const user = req.user._id; // Assumes auth middleware sets req.user

    // Validation
    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ status: false, message: 'Valid product ID is required', data: {} });
    }

    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ status: false, message: 'Product not found', data: {} });
    }

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ status: false, message: 'Rating must be a number between 1 and 5', data: {} });
    }

    const reviewData = {
      user,
      product,
      rating,
      comment
    };

    const review = await Review.create(reviewData);

    // Update product's rating (example: simple average)
    const reviews = await Review.find({ product });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(product, { rating: avgRating });

    return res.status(201).json({
      status: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error (user-product unique index)
      return res.status(400).json({ status: false, message: 'You have already reviewed this product', data: {} });
    }
    console.error('Error creating review:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get All Reviews (for a product or all)
const getAllReviews = async (req, res) => {
  try {
    const { productId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = productId && mongoose.Types.ObjectId.isValid(productId) ? { product: productId } : {};
    const reviews = await Review.find(query)
      .populate('user', 'name')
      .populate('product', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // Sort by newest first

    const total = await Review.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: 'Reviews retrieved successfully',
      data: { reviews, total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get Review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid review ID', data: {} });
    }

    const review = await Review.findById(id)
      .populate('user', 'name')
      .populate('product', 'name');
    if (!review) {
      return res.status(404).json({ status: false, message: 'Review not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Review retrieved successfully',
      data: { ...review._doc }
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Update Review (only rating and comment)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid review ID', data: {} });
    }

    const review = await Review.findOne({ _id: id, user });
    if (!review) {
      return res.status(404).json({ status: false, message: 'Review not found or you are not authorized', data: {} });
    }

    if (rating !== undefined && (isNaN(rating) || rating < 1 || rating > 5)) {
      return res.status(400).json({ status: false, message: 'Rating must be a number between 1 and 5', data: {} });
    }

    // Update only necessary fields
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Update product's rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(review.product, { rating: avgRating });

    return res.status(200).json({
      status: true,
      message: 'Review updated successfully',
      data: { ...review._doc }
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid review ID', data: {} });
    }

    const review = await Review.findOneAndDelete({ _id: id, user });
    if (!review) {
      return res.status(404).json({ status: false, message: 'Review not found or you are not authorized', data: {} });
    }

    // Update product's rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await Product.findByIdAndUpdate(review.product, { rating: avgRating });

    return res.status(200).json({
      status: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
};