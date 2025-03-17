const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  transactionType: { type: String, enum: ['restock', 'sale', 'return'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
