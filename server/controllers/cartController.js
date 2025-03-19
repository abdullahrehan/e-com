// controllers/CartController.js
const mongoose = require('mongoose');
const { Cart, Product } = require('../models/index'); // Adjust path to your models

// Get Cart
const getCart = async (req, res) => {
  try {
    const user = req.user._id; // Assumes req.user is set by authentication middleware
    let cart = await Cart.findOne({ user }).populate('items.product', 'name price');
    if (!cart) {
      cart = await Cart.create({ user, items: [] });
    }
    return res.status(200).json({
      status: true,
      message: 'Cart retrieved successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Add Item to Cart
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = req.user._id;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ status: false, message: 'Invalid product ID', data: {} });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: false, message: 'Product not found', data: {} });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ status: false, message: 'Quantity must be a positive integer', data: {} });
    }

    let cart = await Cart.findOne({ user });
    if (!cart) {
      cart = await Cart.create({ user, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    return res.status(200).json({
      status: true,
      message: 'Item added to cart successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Update Item Quantity
const updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user._id;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ status: false, message: 'Invalid product ID', data: {} });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ status: false, message: 'Quantity must be a positive integer', data: {} });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ status: false, message: 'Cart not found', data: {} });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ status: false, message: 'Product not in cart', data: {} });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({
      status: true,
      message: 'Item quantity updated successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Remove Item from Cart
const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user._id;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ status: false, message: 'Invalid product ID', data: {} });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ status: false, message: 'Cart not found', data: {} });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ status: false, message: 'Product not in cart', data: {} });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return res.status(200).json({
      status: true,
      message: 'Item removed from cart successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const user = req.user._id;

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ status: false, message: 'Cart not found', data: {} });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      status: true,
      message: 'Cart cleared successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
};