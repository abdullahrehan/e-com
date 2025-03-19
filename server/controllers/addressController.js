// controllers/AddressController.js
const mongoose = require('mongoose');
const { Address } = require('../models/index'); // Adjust path as per your project structure

// Create Address
const createAddress = async (req, res) => {
  try {
    const { fullName, street, city, state, zipCode, country, phone, isDefault } = req.body;
    const user = req.user._id; // Assumes auth middleware sets req.user

    // Validation for required fields
    if (!fullName || !street || !city || !state || !zipCode || !country || !phone) {
      return res.status(400).json({ status: false, message: 'All address fields are required', data: {} });
    }

    // Schema-level validation for zipCode and phone will be enforced by Mongoose

    // If isDefault is true, unset any existing default address for this user
    if (isDefault) {
      await Address.updateMany({ user, isDefault: true }, { isDefault: false });
    }

    const addressData = {
      user,
      fullName,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault: isDefault || false
    };

    const address = await Address.create(addressData);

    return res.status(201).json({
      status: true,
      message: 'Address created successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Error creating address:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get All Addresses (for a user)
const getAllAddresses = async (req, res) => {
  try {
    const user = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const addresses = await Address.find({ user })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Address.countDocuments({ user });

    return res.status(200).json({
      status: true,
      message: 'Addresses retrieved successfully',
      data: { addresses, total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get Address by ID
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid address ID', data: {} });
    }

    const address = await Address.findOne({ _id: id, user });
    if (!address) {
      return res.status(404).json({ status: false, message: 'Address not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Address retrieved successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Update Address (only necessary fields)
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, street, city, state, zipCode, country, phone, isDefault } = req.body;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid address ID', data: {} });
    }

    const address = await Address.findOne({ _id: id, user });
    if (!address) {
      return res.status(404).json({ status: false, message: 'Address not found', data: {} });
    }

    // Update only necessary fields if provided
    if (fullName) address.fullName = fullName;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (phone) address.phone = phone;

    // Handle isDefault logic
    if (isDefault !== undefined) {
      if (isDefault) {
        await Address.updateMany({ user, isDefault: true }, { isDefault: false });
      }
      address.isDefault = isDefault;
    }

    await address.save();

    return res.status(200).json({
      status: true,
      message: 'Address updated successfully',
      data: { address }
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid address ID', data: {} });
    }

    const address = await Address.findOneAndDelete({ _id: id, user });
    if (!address) {
      return res.status(404).json({ status: false, message: 'Address not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Address deleted successfully',
      data: { deletedAddress: { id: address._id } }
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress
};