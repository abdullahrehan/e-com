const express = require('express');
const router = express.Router();
const { getAllUsers, deleteAllUsers, deleteUserById } = require('../controllers/adminController');

// Admin Routes
router.get('/admin/users', getAllUsers);
router.delete('/admin/delete-all', deleteAllUsers); 
router.delete('/admin/delete/:id', deleteUserById); 

module.exports = router;
