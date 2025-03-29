// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Succeeded', 'Failed'], default: 'Pending' },
  gatewayPaymentId: { type: String }, // Stripe Payment Intent ID
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);