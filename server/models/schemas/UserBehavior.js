const mongoose = require('mongoose');

const UserBehaviorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  action: { type: String, enum: ['viewed', 'added_to_cart', 'purchased'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('UserBehavior', UserBehaviorSchema);
