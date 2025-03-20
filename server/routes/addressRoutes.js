// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const { createAddress,getAllAddresses,getAddressById,updateAddress,deleteAddress } = require('../controllers/addressController');
const authenticateUser = require('../middleware/auth'); // Assumes you have an auth middleware

// CRUD Routes
router.post('/user/address', authenticateUser, createAddress);          // Create a new address
router.get('/user/address', authenticateUser, getAllAddresses);         // Get all addresses for the user
router.get('/user/address:id', authenticateUser, getAddressById);       // Get a specific address
router.put('/user/address:id', authenticateUser, updateAddress);        // Update an address
router.delete('/user/address:id', authenticateUser, deleteAddress);     // Delete an address

module.exports = router;