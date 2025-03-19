// controllers/WishlistController.js
const mongoose = require('mongoose');
const { Wishlist, Product } = require('../models/index'); // Adjust path as per your project structure

// Create or Get Wishlist (Initialize if not exists)
const createOrGetWishlist = async (req, res) => {
  try {
    const user = req.user._id; // Assumes auth middleware sets req.user

    let wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user, products: [] });
    }

    return res.status(200).json({
      status: true,
      message: 'Wishlist retrieved or created successfully',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Error creating or getting wishlist:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const user = req.user._id;

    const wishlist = await Wishlist.findOne({ user }).populate('products', 'name price');
    if (!wishlist) {
      return res.status(404).json({ status: false, message: 'Wishlist not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Wishlist retrieved successfully',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Update Wishlist (only products)
const updateWishlist = async (req, res) => {
  try {
    const { products } = req.body;
    const user = req.user._id;

    const wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      return res.status(404).json({ status: false, message: 'Wishlist not found', data: {} });
    }

    if (!Array.isArray(products)) {
      return res.status(400).json({ status: false, message: 'Products must be an array', data: {} });
    }

    // Validate each product ID
    for (const productId of products) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ status: false, message: `Invalid product ID: ${productId}`, data: {} });
      }
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ status: false, message: `Product not found: ${productId}`, data: {} });
      }
    }

    wishlist.products = products; // Replace entire products array
    await wishlist.save();

    return res.status(200).json({
      status: true,
      message: 'Wishlist updated successfully',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Delete Wishlist
const deleteWishlist = async (req, res) => {
  try {
    const user = req.user._id;

    const wishlist = await Wishlist.findOneAndDelete({ user });
    if (!wishlist) {
      return res.status(404).json({ status: false, message: 'Wishlist not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Wishlist deleted successfully',
      data: { deletedWishlist: { id: wishlist._id } }
    });
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Add Product to Wishlist
const addProductToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ status: false, message: 'Invalid product ID', data: {} });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: false, message: 'Product not found', data: {} });
    }

    let wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    return res.status(200).json({
      status: true,
      message: 'Product added to wishlist successfully',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Remove Product from Wishlist
const removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ status: false, message: 'Invalid product ID', data: {} });
    }

    const wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      return res.status(404).json({ status: false, message: 'Wishlist not found', data: {} });
    }

    const productIndex = wishlist.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(400).json({ status: false, message: 'Product not in wishlist', data: {} });
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    return res.status(200).json({
      status: true,
      message: 'Product removed from wishlist successfully',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

module.exports = {
  createOrGetWishlist,
  getWishlist,
  updateWishlist,
  deleteWishlist,
  addProductToWishlist,
  removeProductFromWishlist
};