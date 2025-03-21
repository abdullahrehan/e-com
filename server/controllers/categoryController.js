// controllers/CategoryController.js
const mongoose = require('mongoose');
const { Category } = require('../models/index');

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        status: false,
        message: 'Category name is required',
        data: {} 
      });
    }

    // Check if category name already exists (enforcing unique constraint)
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        status: false,
        message: 'Category name already exists',
        data: {}
      });
    }

    // Validate parentCategory if provided
    if (parentCategory) {
      if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
        return res.status(400).json({
          status: false,
          message: 'Invalid parent category ID',
          data: {}
        });
      }

      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          status: false,
          message: 'Parent category not found',
          data: {}
        });
      }
    }

    // Prepare category data
    const categoryData = {
      name,
      description,
      parentCategory: parentCategory || null // Default to null if not provided
    };

    // Create new category
    const category = await Category.create(categoryData);

    console.log(`Category created: ${name}`);
    return res.status(201).json({
      status: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory', 'name description');
    return res.status(200).json({
      status: true,
      message: 'Categories retrieved successfully',
      data: { categories }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Get Category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid category ID',
        data: {}
      });
    }

    const category = await Category.findById(id).populate('parentCategory', 'name description');
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: {}
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Category retrieved successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid category ID',
        data: {}
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: {}
      });
    }

    // Validation for provided fields
    if (name && !name.trim()) {
      return res.status(400).json({
        status: false,
        message: 'Category name cannot be empty',
        data: {}
      });
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          status: false,
          message: 'Category name already exists',
          data: {}
        });
      }
    }

    if (parentCategory) {
      if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
        return res.status(400).json({
          status: false,
          message: 'Invalid parent category ID',
          data: {}
        });
      }

      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          status: false,
          message: 'Parent category not found',
          data: {}
        });
      }

      // Prevent self-referencing
      if (parentCategory === id) {
        return res.status(400).json({
          status: false,
          message: 'Category cannot be its own parent',
          data: {}
        });
      }
    }

    // Update fields only if provided
    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.parentCategory = parentCategory !== undefined ? parentCategory : category.parentCategory;

    await category.save();

    console.log(`Category updated: ${category.name}`);
    return res.status(200).json({
      status: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid category ID',
        data: {}
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: {}
      });
    }

    // Check if category is a parent to other categories
    const hasChildren = await Category.findOne({ parentCategory: id });
    if (hasChildren) {
      return res.status(400).json({
        status: false,
        message: 'Cannot delete category with subcategories',
        data: {}
      });
    }

    await Category.findByIdAndDelete(id);

    console.log(`Category deleted: ${category.name}`);
    return res.status(200).json({
      status: true,
      message: 'Category deleted successfully',
      data: { deletedCategory: { id: category._id, name: category.name } }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};