const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['Credit Card', 'Debit Card', 'PayPal'], required: true },
  paymentGatewayToken: { type: String, required: true }, // Token from payment gateway (e.g., Stripe)
  last4: { type: String }, // Optional: last 4 digits for user reference
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
