// routes/promoCodeRoutes.js
const express = require('express');
const router = express.Router();
const { createPromoCode,getAllPromoCodes,getPromoCodeById,updatePromoCode,deletePromoCode,validatePromoCode } = require('../controllers/promoController');
const authenticateAdmin = require('../middleware/auth'); // Assumes admin-only access for CRUD
const authenticateUser = require('../middleware/auth'); // For validation

// CRUD Routes (Admin-only)
router.post('/promo', authenticateAdmin, createPromoCode);          // Create a new promo code
router.get('/promo', authenticateAdmin, getAllPromoCodes);         // Get all promo codes
router.get('/promo:id', authenticateAdmin, getPromoCodeById);      // Get a specific promo code
router.put('/promo:id', authenticateAdmin, updatePromoCode);       // Update a promo code
router.delete('/promo:id', authenticateAdmin, deletePromoCode);    // Delete a promo code

// User-facing Route
router.post('/validate-promo', authenticateUser, validatePromoCode); // Validate a promo code

module.exports = router;