// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { createInventoryTransaction,getAllInventoryTransactions,getInventoryTransactionById,updateInventoryTransaction,deleteInventoryTransaction } = require('../controllers/inventoryController');
const authenticateAdmin = require('../middleware/auth'); // Assumes admin-only access

// CRUD Routes
router.post('/product/inventory', authenticateAdmin, createInventoryTransaction);          // Create a new transaction
router.get('/product/inventory', authenticateAdmin, getAllInventoryTransactions);         // Get all transactions
router.get('/product/inventory/:id', authenticateAdmin, getInventoryTransactionById);      // Get a specific transaction
router.put('/product/inventory/:id', authenticateAdmin, updateInventoryTransaction);       // Update a transaction
router.delete('/product/inventory/:id', authenticateAdmin, deleteInventoryTransaction);    // Delete a transaction

module.exports = router;