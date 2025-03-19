// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrGetWishlist,
  getWishlist,
  updateWishlist,
  deleteWishlist,
  addProductToWishlist,
  removeProductFromWishlist
} = require('../controllers/WishlistController');
const authenticateUser = require('../middleware/auth'); // Assumes user authentication middleware

// CRUD Routes
router.post('/', authenticateUser, createOrGetWishlist);           // Create or get wishlist
router.get('/', authenticateUser, getWishlist);                   // Get wishlist
router.put('/', authenticateUser, updateWishlist);                // Update wishlist (replace products)
router.delete('/', authenticateUser, deleteWishlist);             // Delete wishlist

// Helper Routes
router.post('/add', authenticateUser, addProductToWishlist);      // Add product to wishlist
router.post('/remove', authenticateUser, removeProductFromWishlist); // Remove product from wishlist

module.exports = router;