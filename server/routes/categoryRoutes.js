// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory } = require('../controllers/categoryController');
const { restrictToAdmin } = require('../middleware/adminAuth');

// CRUD Routes
router.post('/product/category', restrictToAdmin, createCategory);         // Create
router.get('/product/category', getAllCategories);                           // Read All
router.get('/product/category/:id', getCategoryById);                         // Read One
router.put('/product/category/:id', restrictToAdmin, updateCategory);       // Update
router.delete('/product/category/:id', restrictToAdmin, deleteCategory);    // Delete

module.exports = router; 