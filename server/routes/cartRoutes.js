// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {  getCart,addItemToCart,updateItemQuantity,removeItemFromCart,clearCart } = require('../controllers/cartController');
const authenticateUser = require('../middleware/auth'); // Assumes authentication middleware

// Cart Routes
router.get('/', authenticateUser, getCart);                   // Get cart
router.post('/add', authenticateUser, addItemToCart);        // Add item to cart
router.put('/update', authenticateUser, updateItemQuantity); // Update item quantity
router.delete('/remove', authenticateUser, removeItemFromCart); // Remove item from cart
router.delete('/clear', authenticateUser, clearCart);        // Clear cart

module.exports = router;