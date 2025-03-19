// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const { createAddress,getAllAddresses,getAddressById,updateAddress,deleteAddress } = require('../controllers/addressController');
const authenticateUser = require('../middleware/auth'); // Assumes you have an auth middleware

// CRUD Routes
router.post('/', authenticateUser, createAddress);          // Create a new address
router.get('/', authenticateUser, getAllAddresses);         // Get all addresses for the user
router.get('/:id', authenticateUser, getAddressById);       // Get a specific address
router.put('/:id', authenticateUser, updateAddress);        // Update an address
router.delete('/:id', authenticateUser, deleteAddress);     // Delete an address

module.exports = router;