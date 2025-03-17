const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true, min: 0 },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true, min: 0 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
