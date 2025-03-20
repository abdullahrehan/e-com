// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {  getCart,addItemToCart,updateItemQuantity,removeItemFromCart,clearCart } = require('../controllers/cartController');
const authenticateUser = require('../middleware/auth'); // Assumes authentication middleware

// Cart Routes
router.get('/user/cart', authenticateUser, getCart);                   // Get cart
router.post('/user/cart', authenticateUser, addItemToCart);        // Add item to cart
router.put('/user/cart', authenticateUser, updateItemQuantity); // Update item quantity
router.delete('/user/cart', authenticateUser, removeItemFromCart); // Remove item from cart
router.delete('/user/cart/clear', authenticateUser, clearCart);        // Clear cart

module.exports = router;