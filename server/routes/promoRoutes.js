// routes/promoCodeRoutes.js
const express = require('express');
const router = express.Router();
const { createPromoCode,getAllPromoCodes,getPromoCodeById,updatePromoCode,deletePromoCode,validatePromoCode } = require('../controllers/promoController');
const authenticateAdmin = require('../middleware/auth'); // Assumes admin-only access for CRUD
const authenticateUser = require('../middleware/auth'); // For validation

// CRUD Routes (Admin-only)
router.post('/', authenticateAdmin, createPromoCode);          // Create a new promo code
router.get('/', authenticateAdmin, getAllPromoCodes);         // Get all promo codes
router.get('/:id', authenticateAdmin, getPromoCodeById);      // Get a specific promo code
router.put('/:id', authenticateAdmin, updatePromoCode);       // Update a promo code
router.delete('/:id', authenticateAdmin, deletePromoCode);    // Delete a promo code

// User-facing Route
router.post('/validate', authenticateUser, validatePromoCode); // Validate a promo code

module.exports = router;