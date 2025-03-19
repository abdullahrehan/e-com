const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parentCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  }, // Self-referencing for subcategories
}, { timestamps: true });

// Optional: Index for faster queries on parentCategory
CategorySchema.index({ parentCategory: 1 });

module.exports = mongoose.model('Category', CategorySchema);