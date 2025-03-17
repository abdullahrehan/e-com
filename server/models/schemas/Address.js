const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: {
    type: String,
    required: true,
    match: [/^\d{5}(-\d{4})?$/, 'Invalid ZIP code']
  },
  country: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
  },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);
