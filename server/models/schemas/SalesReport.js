const mongoose = require('mongoose');

const SalesReportSchema = new mongoose.Schema({
  totalSales: { type: Number, required: true, min: 0 },
  topSellingProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  date: { type: Date, required: true, index: true },
  numberOfOrders: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SalesReport', SalesReportSchema);
