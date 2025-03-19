// controllers/PromoCodeController.js
const mongoose = require('mongoose');
const { PromoCode } = require('../models/index'); // Adjust path as per your project structure

// Create Promo Code
const createPromoCode = async (req, res) => {
  try {
    const { code, discount, expiryDate, usageLimit } = req.body;

    // Validation
    if (!code || !code.trim()) {
      return res.status(400).json({ status: false, message: 'Promo code is required', data: {} });
    }

    if (!discount || isNaN(discount) || discount < 0) {
      return res.status(400).json({ status: false, message: 'Valid discount (non-negative number) is required', data: {} });
    }

    if (!expiryDate || isNaN(Date.parse(expiryDate))) {
      return res.status(400).json({ status: false, message: 'Valid expiry date is required', data: {} });
    }

    if (!usageLimit || isNaN(usageLimit) || usageLimit < 0) {
      return res.status(400).json({ status: false, message: 'Valid usage limit (non-negative number) is required', data: {} });
    }

    const promoCodeData = {
      code: code.toUpperCase(), // Standardize to uppercase
      discount,
      expiryDate: new Date(expiryDate),
      usageLimit,
      usedCount: 0, // Default
      isActive: true // Default
    };

    const promoCode = await PromoCode.create(promoCodeData);

    return res.status(201).json({
      status: true,
      message: 'Promo code created successfully',
      data: { promoCode }
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error for unique code
      return res.status(400).json({ status: false, message: 'Promo code already exists', data: {} });
    }
    console.error('Error creating promo code:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get All Promo Codes
const getAllPromoCodes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const promoCodes = await PromoCode.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // Sort by newest first

    const total = await PromoCode.countDocuments();

    return res.status(200).json({
      status: true,
      message: 'Promo codes retrieved successfully',
      data: { promoCodes, total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get Promo Code by ID
const getPromoCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid promo code ID', data: {} });
    }

    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ status: false, message: 'Promo code not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Promo code retrieved successfully',
      data: { promoCode }
    });
  } catch (error) {
    console.error('Error fetching promo code:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Update Promo Code (only discount, expiryDate, usageLimit, isActive)
const updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount, expiryDate, usageLimit, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid promo code ID', data: {} });
    }

    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ status: false, message: 'Promo code not found', data: {} });
    }

    // Validation for provided fields
    if (discount !== undefined && (isNaN(discount) || discount < 0)) {
      return res.status(400).json({ status: false, message: 'Valid discount (non-negative number) is required', data: {} });
    }

    if (expiryDate !== undefined && isNaN(Date.parse(expiryDate))) {
      return res.status(400).json({ status: false, message: 'Valid expiry date is required', data: {} });
    }

    if (usageLimit !== undefined && (isNaN(usageLimit) || usageLimit < 0)) {
      return res.status(400).json({ status: false, message: 'Valid usage limit (non-negative number) is required', data: {} });
    }

    if (usageLimit !== undefined && usageLimit < promoCode.usedCount) {
      return res.status(400).json({ status: false, message: 'Usage limit cannot be less than current used count', data: {} });
    }

    // Update only necessary fields
    if (discount !== undefined) promoCode.discount = discount;
    if (expiryDate !== undefined) promoCode.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) promoCode.usageLimit = usageLimit;
    if (isActive !== undefined) promoCode.isActive = isActive;

    await promoCode.save();

    return res.status(200).json({
      status: true,
      message: 'Promo code updated successfully',
      data: { promoCode }
    });
  } catch (error) {
    console.error('Error updating promo code:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Delete Promo Code
const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid promo code ID', data: {} });
    }

    const promoCode = await PromoCode.findByIdAndDelete(id);
    if (!promoCode) {
      return res.status(404).json({ status: false, message: 'Promo code not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Promo code deleted successfully',
      data: { deletedPromoCode: { id: promoCode._id, code: promoCode.code } }
    });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Additional API: Validate Promo Code (for user application)
const validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ status: false, message: 'Promo code is required', data: {} });
    }

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promoCode) {
      return res.status(404).json({ status: false, message: 'Promo code not found', data: {} });
    }

    if (!promoCode.isActive) {
      return res.status(400).json({ status: false, message: 'Promo code is inactive', data: {} });
    }

    if (promoCode.expiryDate < new Date()) {
      return res.status(400).json({ status: false, message: 'Promo code has expired', data: {} });
    }

    if (promoCode.usedCount >= promoCode.usageLimit) {
      return res.status(400).json({ status: false, message: 'Promo code usage limit reached', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Promo code is valid',
      data: { promoCode: { code: promoCode.code, discount: promoCode.discount } }
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode
};