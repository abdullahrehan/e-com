const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

// Unique index to prevent multiple reviews per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
