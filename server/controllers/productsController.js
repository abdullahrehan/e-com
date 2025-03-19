// controllers/ProductsController.js
const mongoose = require('mongoose');
const { Product, Category } = require('../models/index');
const { uploadFileToS3 } = require('../utils/s3');

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        status: false,
        message: 'Product name is required',
        data: {}
      });
    }

    if (!category) {
      return res.status(400).json({
        status: false,
        message: 'Category is required',
        data: {}
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid category ID',
        data: {}
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        status: false,
        message: 'Category not found',
        data: {}
      });
    }

    if (!price || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        status: false,
        message: 'Valid price (non-negative number) is required',
        data: {}
      });
    }

    if (!stock || isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({
        status: false,
        message: 'Valid stock quantity (non-negative number) is required',
        data: {}
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'At least one image file is required',
        data: {}
      });
    }

    // Upload multiple images to S3
    const imageUploadPromises = req.files.map(file => uploadFileToS3(file));
    const uploadedImages = await Promise.all(imageUploadPromises);
    const imageUrls = uploadedImages.map(image => image.original);

    const productData = {
      name,
      category,
      price: Number(price),
      description,
      images: imageUrls,
      stock: Number(stock),
      rating: 0,
      reviews: []
    };

    const product = await Product.create(productData);

    console.log(`Product created: ${name}`);
    return res.status(201).json({
      status: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name description');
    return res.status(200).json({
      status: true,
      message: 'Products retrieved successfully',
      data: { products }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid product ID',
        data: {}
      });
    }

    const product = await Product.findById(id).populate('category', 'name description');
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
        data: {}
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Product retrieved successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid product ID',
        data: {}
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
        data: {}
      });
    }

    // Validation for provided fields
    if (name && !name.trim()) {
      return res.status(400).json({
        status: false,
        message: 'Product name cannot be empty',
        data: {}
      });
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          status: false,
          message: 'Invalid category ID',
          data: {}
        });
      }
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          status: false,
          message: 'Category not found',
          data: {}
        });
      }
    }

    if (price && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({
        status: false,
        message: 'Valid price (non-negative number) is required',
        data: {}
      });
    }

    if (stock && (isNaN(stock) || Number(stock) < 0)) {
      return res.status(400).json({
        status: false,
        message: 'Valid stock quantity (non-negative number) is required',
        data: {}
      });
    }

    // Handle image updates if files are provided
    let imageUrls = product.images;
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map(file => uploadFileToS3(file));
      const uploadedImages = await Promise.all(imageUploadPromises);
      imageUrls = uploadedImages.map(image => image.original);
    }

    // Update fields only if provided
    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price !== undefined ? Number(price) : product.price;
    product.description = description !== undefined ? description : product.description;
    product.images = imageUrls;
    product.stock = stock !== undefined ? Number(stock) : product.stock;

    await product.save();

    console.log(`Product updated: ${product.name}`);
    return res.status(200).json({
      status: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid product ID',
        data: {}
      });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
        data: {}
      });
    }

    console.log(`Product deleted: ${product.name}`);
    return res.status(200).json({
      status: true,
      message: 'Product deleted successfully',
      data: { deletedProduct: { id: product._id, name: product.name } }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};