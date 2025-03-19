// controllers/ComplaintController.js
const mongoose = require('mongoose');
const { Complaint, User, Order } = require('../models/index');

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const { userId, orderId, message } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: 'User ID is required',
        data: {}
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid user ID',
        data: {}
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: 'User not found',
        data: {}
      });
    }

    if (!orderId) {
      return res.status(400).json({
        status: false,
        message: 'Order ID is required',
        data: {}
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid order ID',
        data: {}
      });
    }

    const orderExists = await Order.findById(orderId);
    if (!orderExists) {
      return res.status(400).json({
        status: false,
        message: 'Order not found',
        data: {}
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: false,
        message: 'Complaint message is required and cannot be empty',
        data: {}
      });
    }

    // Prepare complaint data
    const complaintData = {
      userId,
      orderId,
      message,
      status: 'Pending', // Default value from schema
      response: undefined // Initially undefined
    };

    // Create new complaint
    const complaint = await Complaint.create(complaintData);

    console.log(`Complaint created for user: ${userId}, order: ${orderId}`);
    return res.status(201).json({
      status: true,
      message: 'Complaint created successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Get All Complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .populate('orderId', 'orderNumber totalAmount'); // Adjust fields as per your Order schema
    return res.status(200).json({
      status: true,
      message: 'Complaints retrieved successfully',
      data: { complaints }
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Get Complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid complaint ID',
        data: {}
      });
    }

    const complaint = await Complaint.findById(id)
      .populate('userId', 'name email')
      .populate('orderId', 'orderNumber totalAmount'); // Adjust fields as per your Order schema
    if (!complaint) {
      return res.status(404).json({
        status: false,
        message: 'Complaint not found',
        data: {}
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Complaint retrieved successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Update Complaint (Only status and response)
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid complaint ID',
        data: {}
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        status: false,
        message: 'Complaint not found',
        data: {}
      });
    }

    // Validation for provided fields
    if (status && !['Pending', 'Resolved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        status: false,
        message: 'Status must be one of: Pending, Resolved, Rejected',
        data: {}
      });
    }

    if (response !== undefined && !response.trim()) {
      return res.status(400).json({
        status: false,
        message: 'Response cannot be empty if provided',
        data: {}
      });
    }

    // Update only necessary fields
    complaint.status = status || complaint.status;
    complaint.response = response !== undefined ? response : complaint.response;

    await complaint.save();

    console.log(`Complaint updated: ${id}`);
    return res.status(200).json({
      status: true,
      message: 'Complaint updated successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

// Delete Complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid complaint ID',
        data: {}
      });
    }

    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return res.status(404).json({
        status: false,
        message: 'Complaint not found',
        data: {}
      });
    }

    console.log(`Complaint deleted: ${id}`);
    return res.status(200).json({
      status: true,
      message: 'Complaint deleted successfully',
      data: { deletedComplaint: { id: complaint._id } }
    });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: {}
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
};