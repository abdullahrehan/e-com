// controllers/OrderController.js
const mongoose = require('mongoose');
const { Order, User, Product, Address, PaymentMethod } = require('../models/index');

// Create Order
const createOrder = async (req, res) => {
  try {
    const { user, products, totalAmount, shippingAddress, paymentMethod, promoCode } = req.body;

    // Validation
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ status: false, message: 'Valid user ID is required', data: {} });
    }

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ status: false, message: 'User not found', data: {} });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ status: false, message: 'At least one product is required', data: {} });
    }

    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ status: false, message: 'Invalid product ID', data: {} });
      }
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ status: false, message: 'Quantity must be at least 1', data: {} });
      }
      const productExists = await Product.findById(item.product);
      if (!productExists) {
        return res.status(400).json({ status: false, message: `Product ${item.product} not found`, data: {} });
      }
      if (productExists.stock < item.quantity) {
        return res.status(400).json({ status: false, message: `Insufficient stock for product ${item.product}`, data: {} });
      }
    }

    if (!totalAmount || isNaN(totalAmount) || totalAmount < 0) {
      return res.status(400).json({ status: false, message: 'Valid total amount is required', data: {} });
    }

    if (!shippingAddress || !mongoose.Types.ObjectId.isValid(shippingAddress)) {
      return res.status(400).json({ status: false, message: 'Valid shipping address ID is required', data: {} });
    }

    const addressExists = await Address.findById(shippingAddress);
    if (!addressExists) {
      return res.status(400).json({ status: false, message: 'Shipping address not found', data: {} });
    }

    if (!paymentMethod || !mongoose.Types.ObjectId.isValid(paymentMethod)) {
      return res.status(400).json({ status: false, message: 'Valid payment method ID is required', data: {} });
    }

    const paymentMethodExists = await PaymentMethod.findById(paymentMethod);
    if (!paymentMethodExists) {
      return res.status(400).json({ status: false, message: 'Payment method not found', data: {} });
    }

    if (promoCode && !mongoose.Types.ObjectId.isValid(promoCode)) {
      return res.status(400).json({ status: false, message: 'Invalid promo code ID', data: {} });
    }

    // Generate unique order number (example implementation)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderData = {
      user,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      promoCode,
      status: 'Processing', // Default
      orderNumber
    };

    const order = await Order.create(orderData);

    // Update product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    console.log(`Order created: ${orderNumber}`);
    return res.status(201).json({
      status: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get All Orders (User or Admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const user = req.user._id; // From auth middleware
    const isAdmin = req.user.role === 'admin'; // Assuming role is in user object

    const query = isAdmin ? {} : { user };
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .populate('shippingAddress', 'street city state zip')
      .populate('paymentMethod', 'type last4')
      .populate('promoCode', 'code discount')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: 'Orders retrieved successfully',
      data: { orders, total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user._id;
    const isAdmin = req.user.role === 'admin';

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid order ID', data: {} });
    }

    const query = isAdmin ? { _id: id } : { _id: id, user };
    const order = await Order.findOne(query)
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .populate('shippingAddress', 'street city state zip')
      .populate('paymentMethod', 'type last4')
      .populate('promoCode', 'code discount');

    if (!order) {
      return res.status(404).json({ status: false, message: 'Order not found', data: {} });
    }

    return res.status(200).json({
      status: true,
      message: 'Order retrieved successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Update Order (Only status, shippedAt, deliveredAt)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, shippedAt, deliveredAt } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid order ID', data: {} });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ status: false, message: 'Order not found', data: {} });
    }

    // Validation for provided fields
    if (status && !['Processing', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ status: false, message: 'Invalid status value', data: {} });
    }

    if (shippedAt && isNaN(Date.parse(shippedAt))) {
      return res.status(400).json({ status: false, message: 'Invalid shippedAt date', data: {} });
    }

    if (deliveredAt && isNaN(Date.parse(deliveredAt))) {
      return res.status(400).json({ status: false, message: 'Invalid deliveredAt date', data: {} });
    }

    // Update only necessary fields
    order.status = status || order.status;
    order.shippedAt = shippedAt ? new Date(shippedAt) : order.shippedAt;
    order.deliveredAt = deliveredAt ? new Date(deliveredAt) : order.deliveredAt;

    await order.save();

    console.log(`Order updated: ${order.orderNumber}`);
    return res.status(200).json({
      status: true,
      message: 'Order updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: 'Invalid order ID', data: {} });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ status: false, message: 'Order not found', data: {} });
    }

    console.log(`Order deleted: ${order.orderNumber}`);
    return res.status(200).json({
      status: true,
      message: 'Order deleted successfully',
      data: { deletedOrder: { id: order._id, orderNumber: order.orderNumber } }
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};