const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String },
  images: [
    {
      type: {
        original: { type: String, default: null },
        thumbnail: { type: String, default: null },
        blurred: { type: String, default: null },
      },
      default: { original: null, thumbnail: null, blurred: null },
    },
  ],
  stock: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);