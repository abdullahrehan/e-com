const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1 },
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  promoCode: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
  orderNumber: { type: String, unique: true },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
