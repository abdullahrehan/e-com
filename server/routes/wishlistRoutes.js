// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const { createOrGetWishlist,getWishlist,updateWishlist,deleteWishlist,addProductToWishlist,removeProductFromWishlist } = require('../controllers/wishlistController');
const authenticateUser = require('../middleware/auth'); // Assumes user authentication middleware

// CRUD Routes
router.post('/user/wishlist', authenticateUser, createOrGetWishlist);           // Create or get wishlist
router.get('/user/wishlist', authenticateUser, getWishlist);                   // Get wishlist
router.put('/user/wishlist', authenticateUser, updateWishlist);                // Update wishlist (replace products)
router.delete('/user/wishlist', authenticateUser, deleteWishlist);             // Delete wishlist

// Helper Routes
router.post('/add/wishlist', authenticateUser, addProductToWishlist);      // Add product to wishlist
router.post('/remove/wishlist', authenticateUser, removeProductFromWishlist); // Remove product from wishlist

module.exports = router;