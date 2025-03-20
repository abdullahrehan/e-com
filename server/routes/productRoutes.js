// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct } = require('../controllers/productsController');
const authenticateAdmin = require('../middleware/auth');
const upload = require('../middleware/multer');

// CRUD Routes
router.post('/product', authenticateAdmin, upload.array('images', 5), createProduct);         // Create
router.get('/product', getAllProducts);                                                       // Read All
router.get('/product:id', getProductById);                                                    // Read One
router.put('/product:id', authenticateAdmin, upload.array('images', 5), updateProduct);       // Update
router.delete('/product:id', authenticateAdmin, deleteProduct);                               // Delete

module.exports = router;