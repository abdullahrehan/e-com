const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PaymentMethod } = require('../models/index');

const createPaymentMethod = async (req, res) => {
  try {
    const { type, paymentGatewayToken, last4, isDefault } = req.body;
    const user = req.user._id;

    if (!type || !['Credit Card', 'Debit Card'].includes(type)) { // Remove PayPal if only using Stripe
      return res.status(400).json({ status: false, message: 'Invalid payment type', data: {} });
    }

    if (!paymentGatewayToken) {
      return res.status(400).json({ status: false, message: 'Payment method ID is required', data: {} });
    }

    // Verify the Payment Method with Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentGatewayToken);
    if (!paymentMethod || paymentMethod.type !== type.toLowerCase().replace(' ', '_')) {
      return res.status(400).json({ status: false, message: 'Invalid payment method', data: {} });
    }

    if (last4 && last4 !== paymentMethod.card.last4) {
      return res.status(400).json({ status: false, message: 'Last 4 digits mismatch', data: {} });
    }

    if (isDefault) {
      await PaymentMethod.updateMany({ user, isDefault: true }, { isDefault: false });
    }

    const paymentMethodData = {
      user,
      type,
      paymentGatewayToken, // Stripe Payment Method ID (pm_xxx)
      last4: paymentMethod.card.last4,
      isDefault: isDefault || false,
    };

    const newPaymentMethod = await PaymentMethod.create(paymentMethodData);

    return res.status(201).json({
      status: true,
      message: 'Payment method created successfully',
      data: { paymentMethod: newPaymentMethod },
    });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
  }
};
  // Get All Payment Methods
  const getAllPaymentMethods = async (req, res) => {
    try {
      const user = req.user._id; // From auth middleware
      const paymentMethods = await PaymentMethod.find({ user }).populate('user', 'name email');
      return res.status(200).json({
        status: true,
        message: 'Payment methods retrieved successfully',
        data: { paymentMethods }
      });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Get Payment Method by ID
  const getPaymentMethodById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, message: 'Invalid payment method ID', data: {} });
      }
  
      const paymentMethod = await PaymentMethod.findOne({ _id: id, user });
      if (!paymentMethod) {
        return res.status(404).json({ status: false, message: 'Payment method not found', data: {} });
      }
  
      return res.status(200).json({
        status: true,
        message: 'Payment method retrieved successfully',
        data: { paymentMethod }
      });
    } catch (error) {
      console.error('Error fetching payment method:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Update Payment Method
  const updatePaymentMethod = async (req, res) => {
    try {
      const { id } = req.params;
      const { isDefault } = req.body;
      const user = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, message: 'Invalid payment method ID', data: {} });
      }
  
      const paymentMethod = await PaymentMethod.findOne({ _id: id, user });
      if (!paymentMethod) {
        return res.status(404).json({ status: false, message: 'Payment method not found', data: {} });
      }
  
      if (isDefault === true) {
        await PaymentMethod.updateMany({ user, _id: { $ne: id }, isDefault: true }, { isDefault: false });
      }
  
      paymentMethod.isDefault = isDefault !== undefined ? isDefault : paymentMethod.isDefault;
      await paymentMethod.save();
  
      return res.status(200).json({
        status: true,
        message: 'Payment method updated successfully',
        data: { paymentMethod }
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Delete Payment Method
  const deletePaymentMethod = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, message: 'Invalid payment method ID', data: {} });
      }
  
      const paymentMethod = await PaymentMethod.findOneAndDelete({ _id: id, user });
      if (!paymentMethod) {
        return res.status(404).json({ status: false, message: 'Payment method not found', data: {} });
      }
  
      return res.status(200).json({
        status: true,
        message: 'Payment method deleted successfully',
        data: { deletedPaymentMethod: { id: paymentMethod._id } }
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Process Payment
  const processPayment = async (req, res) => {
    try {
      const { orderId, paymentMethodId, amount } = req.body;
      const user = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ status: false, message: 'Invalid order ID', data: {} });
      }
  
      if (!mongoose.Types.ObjectId.isValid(paymentMethodId)) {
        return res.status(400).json({ status: false, message: 'Invalid payment method ID', data: {} });
      }
  
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ status: false, message: 'Valid amount is required', data: {} });
      }
  
      const paymentMethod = await PaymentMethod.findOne({ _id: paymentMethodId, user });
      if (!paymentMethod) {
        return res.status(404).json({ status: false, message: 'Payment method not found', data: {} });
      }
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method: paymentMethod.paymentGatewayToken,
        confirmation_method: 'manual',
        confirm: true,
        metadata: { orderId: orderId.toString(), userId: user.toString() },
      });
  
      const paymentData = {
        user,
        orderId,
        paymentMethodId,
        amount,
        status: paymentIntent.status === 'succeeded' ? 'Succeeded' : 'Pending',
        gatewayPaymentId: paymentIntent.id,
      };
  
      const payment = await Payment.create(paymentData);
  
      return res.status(201).json({
        status: true,
        message: 'Payment processed successfully',
        data: { payment },
      });
    } catch (error) {
      if (error.type === 'StripeCardError') {
        return res.status(400).json({ status: false, message: error.message, data: {} });
      }
      console.error('Error processing payment:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  // Get All Payments (User)
  const getAllPayments = async (req, res) => {
    try {
      const user = req.user._id;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      const payments = await Payment.find({ user })
        .populate('orderId', 'orderNumber totalAmount')
        .populate('paymentMethodId', 'type last4')
        .skip(skip)
        .limit(parseInt(limit));
  
      const total = await Payment.countDocuments({ user });
  
      return res.status(200).json({
        status: true,
        message: 'Payments retrieved successfully',
        data: { payments, total, page: parseInt(page), limit: parseInt(limit) }
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Get Payment by ID
  const getPaymentById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, message: 'Invalid payment ID', data: {} });
      }
  
      const payment = await Payment.findOne({ _id: id, user })
        .populate('orderId', 'orderNumber totalAmount')
        .populate('paymentMethodId', 'type last4');
      if (!payment) {
        return res.status(404).json({ status: false, message: 'Payment not found', data: {} });
      }
  
      return res.status(200).json({
        status: true,
        message: 'Payment retrieved successfully',
        data: { payment }
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Get All Payments (Admin)
  const getAllAdminPayments = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      const payments = await Payment.find()
        .populate('user', 'name email')
        .populate('orderId', 'orderNumber totalAmount')
        .populate('paymentMethodId', 'type last4')
        .skip(skip)
        .limit(parseInt(limit));
  
      const total = await Payment.countDocuments();
  
      return res.status(200).json({
        status: true,
        message: 'All payments retrieved successfully',
        data: { payments, total, page: parseInt(page), limit: parseInt(limit) }
      });
    } catch (error) {
      console.error('Error fetching all payments:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Process Refund
  const processRefund = async (req, res) => {
    try {
      const { paymentId, amount } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        return res.status(400).json({ status: false, message: 'Invalid payment ID', data: {} });
      }
  
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ status: false, message: 'Valid refund amount is required', data: {} });
      }
  
      const payment = await Payment.findById(paymentId);
      if (!payment || payment.status !== 'Succeeded') {
        return res.status(400).json({ status: false, message: 'Payment not found or not eligible for refund', data: {} });
      }
  
      if (amount > payment.amount) {
        return res.status(400).json({ status: false, message: 'Refund amount exceeds original payment', data: {} });
      }
  
      const refund = await stripe.refunds.create({
        payment_intent: payment.gatewayPaymentId,
        amount: Math.round(amount * 100) // Convert to cents
      });
  
      // Optionally, log refund in a separate Refund model
      return res.status(200).json({
        status: true,
        message: 'Refund processed successfully',
        data: { refundId: refund.id }
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  // Webhook Handler
  const handlePaymentWebhook = async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ status: false, message: 'Webhook verification failed', data: {} });
      }
  
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        await Payment.updateOne(
          { gatewayPaymentId: paymentIntent.id },
          { status: 'Succeeded' }
        );
      } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        await Payment.updateOne(
          { gatewayPaymentId: paymentIntent.id },
          { status: 'Failed' }
        );
      }
  
      return res.status(200).json({ status: true, message: 'Webhook processed successfully', data: {} });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return res.status(500).json({ status: false, message: 'Internal server error', data: {} });
    }
  };
  
  module.exports = {
    createPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod,
    processPayment,
    getAllPayments,
    getPaymentById,
    getAllAdminPayments,
    processRefund,
    handlePaymentWebhook
  };