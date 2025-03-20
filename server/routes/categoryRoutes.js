// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory } = require('../controllers/categoryController');
const authenticateAdmin = require('../middleware/auth');

// CRUD Routes
router.post('/product/category', authenticateAdmin, createCategory);         // Create
router.get('/product/category', getAllCategories);                           // Read All
router.get('/product/category:id', getCategoryById);                         // Read One
router.put('/product/category:id', authenticateAdmin, updateCategory);       // Update
router.delete('/product/category:id', authenticateAdmin, deleteCategory);    // Delete

module.exports = router;