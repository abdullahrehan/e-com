// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { createReview,getAllReviews,getReviewById,updateReview,deleteReview } = require('../controllers/reviewController');
const authenticateUser = require('../middleware/auth'); // Assumes user authentication middleware

// CRUD Routes
router.post('/review', authenticateUser, createReview);          // Create a new review
router.get('/review', getAllReviews);                            // Get all reviews (public, filterable by product)
router.get('/review/:id', getReviewById);                        // Get a specific review (public)
router.put('/review/:id', authenticateUser, updateReview);       // Update a review
router.delete('/review/:id', authenticateUser, deleteReview);    // Delete a review

module.exports = router;