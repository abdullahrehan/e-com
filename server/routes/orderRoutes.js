// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder,getAllOrders,getOrderById,updateOrder,deleteOrder } = require('../controllers/ordersController');
const authenticateUser = require('../middleware/auth');
const authenticateAdmin = require('../middleware/auth');

// CRUD Routes
router.post('/', authenticateUser, createOrder);          // Create (User)
router.get('/', authenticateUser, getAllOrders);          // Read All (User/Admin)
router.get('/:id', authenticateUser, getOrderById);       // Read One (User/Admin)
router.put('/:id', authenticateAdmin, updateOrder);       // Update (Admin)
router.delete('/:id', authenticateAdmin, deleteOrder);    // Delete (Admin)

module.exports = router;