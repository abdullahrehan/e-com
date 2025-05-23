// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder,getAllOrders,getOrderById,updateOrder,deleteOrder } = require('../controllers/ordersController');
const authenticateUser = require('../middleware/auth');
const authenticateAdmin = require('../middleware/auth');

// CRUD Routes
router.post('/order', authenticateUser, createOrder);          // Create (User)
router.get('/order', authenticateUser, getAllOrders);          // Read All (User/Admin)
router.get('/order:id', authenticateUser, getOrderById);       // Read One (User/Admin)
router.put('/order:id', authenticateAdmin, updateOrder);       // Update (Admin)
router.delete('/order:id', authenticateAdmin, deleteOrder);    // Delete (Admin)

module.exports = router;