// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct } = require('../controllers/productsController');
const authenticateAdmin = require('../middleware/auth');
const upload = require('../middleware/multer');

// CRUD Routes
router.post('/', authenticateAdmin, upload.array('images', 5), createProduct);         // Create
router.get('/', getAllProducts);                                                       // Read All
router.get('/:id', getProductById);                                                    // Read One
router.put('/:id', authenticateAdmin, upload.array('images', 5), updateProduct);       // Update
router.delete('/:id', authenticateAdmin, deleteProduct);                               // Delete

module.exports = router;