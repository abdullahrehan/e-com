const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending' },
  response: { type: String }, // Admin response
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
