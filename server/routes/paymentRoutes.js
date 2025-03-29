// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
// const { createPaymentMethod,getAllPaymentMethods,getPaymentMethodById,updatePaymentMethod,deletePaymentMethod,processPayment,getAllPayments,getPaymentById,getAllAdminPayments,processRefund,handlePaymentWebhook } = require('../controllers/paymentController');
// const authenticateUser = require('../middleware/auth');
// const authenticateAdmin = require('../middleware/auth');

// // Payment Methods Routes
// router.post('/payment-methods', authenticateUser, createPaymentMethod);
// router.get('/payment-methods', authenticateUser, getAllPaymentMethods);
// router.get('/payment-methods/:id', authenticateUser, getPaymentMethodById);
// router.put('/payment-methods/:id', authenticateUser, updatePaymentMethod);
// router.delete('/payment-methods/:id', authenticateUser, deletePaymentMethod);

// // Payment Processing Routes
// router.post('/payments', authenticateUser, processPayment);
// router.get('/payments', authenticateUser, getAllPayments);
// router.get('/payments/:id', authenticateUser, getPaymentById);

// // Admin Routes
// router.get('/admin/payments', authenticateAdmin, getAllAdminPayments);
// router.post('/refunds', authenticateAdmin, processRefund);

// // Webhook Route
// router.post('/webhooks/payment', handlePaymentWebhook);

module.exports = router;