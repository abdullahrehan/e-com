// controllers/InventoryController.js
const mongoose = require('mongoose');
const { Inventory, Product } = require('../models/index'); // Adjust path as per your project structure

// Create Inventory Transaction
const createInventoryTransaction = async (req, res) => {
  try {
    const { productId, transactionType, quantity } = req.body;

    // Validation
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ status: false, message: 'Valid product ID is required', data: {} });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: false, message: 'Product not found', data: {} });
    }

    if (!transactionType || !['restock', 'sale', 'return'].includes(transactionType)) {
      return res.status(400).json({
        status: false,
        message: 'Transaction type must be one of: restock, sale, return',
        data: {}
      });
    }

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ status: false, message: 'Valid quantity (greater than 0) is required', data: {} });
    }

    // Update product stock based on transaction type
    if (transactionType === 'restock') {
      product.stock += quantity;
    } else if (transactionType === 'sale') {
      if (product.stock < quantity) {
        return res.status(400).json({ status: false, message: 'Insufficient stock for sale', data: {} });
      }
      product.stock -= quantity;
    } else if (transactionType === 'return') {
      product.stock += quantity;
    }

    await product.save();

    const inventoryData = {
      productId,
      transactionType,
      quantity,
      date: new Date() // Default to current time
    };

    const inventory = await Inventory.create(inventoryData);

    return res.status(201).json({
      status: true,
      message: 'Inventory transaction created successfully',
      data: { inventory }
    });
  } catch (error) {
    console.error('Error creating inventory transaction:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get All Inventory Transactions
const getAllInventoryTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, productId } = req.query;
    const skip = (page - 1) * limit;

    const query = productId && mongoose.Types.ObjectId.isValid(productId) ? { productId } : {};
    const transactions = await Inventory.find(query)
      .populate('productId', 'name stock')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 }); // Sort by date descending

    const total = await Inventory.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: 'Inventory transactions retrieved successfully',
      data: { transactions, total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get Inventory Transaction by ID
const getInventoryTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid inventory transaction ID', data: {} });
    }

    const inventory = await Inventory.findById(id).populate('productId', 'name stock');
    if (!inventory) {
      return res.status(404).json({ status: false, message: 'Inventory transaction not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Inventory transaction retrieved successfully',
      data: { inventory }
    });
  } catch (error) {
    console.error('Error fetching inventory transaction:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Update Inventory Transaction (only quantity)
const updateInventoryTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid inventory transaction ID', data: {} });
    }

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ status: false, message: 'Inventory transaction not found', data: {} });
    }

    if (quantity === undefined || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ status: false, message: 'Valid quantity (greater than 0) is required', data: {} });
    }

    const product = await Product.findById(inventory.productId);
    if (!product) {
      return res.status(400).json({ status: false, message: 'Associated product not found', data: {} });
    }

    // Adjust stock based on quantity change
    const oldQuantity = inventory.quantity;
    const quantityDiff = quantity - oldQuantity;

    if (inventory.transactionType === 'restock') {
      product.stock += quantityDiff;
    } else if (inventory.transactionType === 'sale') {
      if (product.stock + oldQuantity < quantity) {
        return res.status(400).json({ status: false, message: 'Insufficient stock for updated sale quantity', data: {} });
      }
      product.stock -= quantityDiff;
    } else if (inventory.transactionType === 'return') {
      product.stock += quantityDiff;
    }

    await product.save();
    inventory.quantity = quantity;
    await inventory.save();

    return res.status(200).json({
      status: true,
      message: 'Inventory transaction updated successfully',
      data: { inventory }
    });
  } catch (error) {
    console.error('Error updating inventory transaction:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Delete Inventory Transaction
const deleteInventoryTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid inventory transaction ID', data: {} });
    }

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ status: false, message: 'Inventory transaction not found', data: {} });
    }

    const product = await Product.findById(inventory.productId);
    if (!product) {
      return res.status(400).json({ status: false, message: 'Associated product not found', data: {} });
    }

    // Reverse stock changes
    if (inventory.transactionType === 'restock') {
      product.stock -= inventory.quantity;
    } else if (inventory.transactionType === 'sale') {
      product.stock += inventory.quantity;
    } else if (inventory.transactionType === 'return') {
      product.stock -= inventory.quantity;
    }

    await product.save();
    await Inventory.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: 'Inventory transaction deleted successfully',
      data: { deletedInventory: { id: inventory._id } }
    });
  } catch (error) {
    console.error('Error deleting inventory transaction:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

module.exports = {
  createInventoryTransaction,
  getAllInventoryTransactions,
  getInventoryTransactionById,
  updateInventoryTransaction,
  deleteInventoryTransaction
};