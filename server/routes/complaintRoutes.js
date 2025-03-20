// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const { createComplaint,getAllComplaints,getComplaintById,updateComplaint,deleteComplaint } = require('../controllers/complaintController');
const authenticateUser = require('../middleware/auth'); // For user authentication
const authenticateAdmin = require('../middleware/auth'); // For admin authentication

// CRUD Routes
router.post('/user/complaint', authenticateUser, createComplaint);          // Create (User)
router.get('/user/complaint', authenticateAdmin, getAllComplaints);         // Read All (Admin)
router.get('/user/complaint:id', authenticateUser, getComplaintById);       // Read One (User/Admin)
router.put('/user/complaint:id', authenticateAdmin, updateComplaint);       // Update (Admin)
router.delete('/user/complaint:id', authenticateAdmin, deleteComplaint);    // Delete (Admin)

module.exports = router;