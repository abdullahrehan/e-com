// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { createInventoryTransaction,getAllInventoryTransactions,getInventoryTransactionById,updateInventoryTransaction,deleteInventoryTransaction } = require('../controllers/inventoryController');
const authenticateAdmin = require('../middleware/auth'); // Assumes admin-only access

// CRUD Routes
router.post('/', authenticateAdmin, createInventoryTransaction);          // Create a new transaction
router.get('/', authenticateAdmin, getAllInventoryTransactions);         // Get all transactions
router.get('/:id', authenticateAdmin, getInventoryTransactionById);      // Get a specific transaction
router.put('/:id', authenticateAdmin, updateInventoryTransaction);       // Update a transaction
router.delete('/:id', authenticateAdmin, deleteInventoryTransaction);    // Delete a transaction

module.exports = router;