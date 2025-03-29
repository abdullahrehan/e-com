// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct,deleteImageFromProduct } = require('../controllers/productsController');
const {restrictToAdmin} = require('../middleware/adminAuth');
const upload = require('../middleware/multer');

// CRUD Routes
router.post('/product', restrictToAdmin, upload.array('images', 5), createProduct);         // Create
router.get('/product', getAllProducts);                                                       // Read All
router.get('/product/:id', getProductById);                                                    // Read One
router.put('/product/:id', restrictToAdmin, upload.array('images', 5), updateProduct);       // Update
router.delete('/product/:id', restrictToAdmin, deleteProduct);                               // Delete
// Add this new route after existing routes
router.delete('/product/:id/images/:imageIndex', restrictToAdmin, deleteImageFromProduct);
module.exports = router;