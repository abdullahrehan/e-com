// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory } = require('../controllers/categoryController');
const authenticateAdmin = require('../middleware/auth');

// CRUD Routes
router.post('/', authenticateAdmin, createCategory);         // Create
router.get('/', getAllCategories);                           // Read All
router.get('/:id', getCategoryById);                         // Read One
router.put('/:id', authenticateAdmin, updateCategory);       // Update
router.delete('/:id', authenticateAdmin, deleteCategory);    // Delete

module.exports = router;