const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { productId, quantity, shippingAddress } = req.body;

  if (!productId || !quantity) {
    res.status(400);
    throw new Error('Please provide product ID and quantity');
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  const totalPrice = product.price * quantity;

  // Create order
  const order = await Order.create({
    product: productId,
    buyer: req.user._id,
    artisan: product.artisan,
    quantity,
    totalPrice,
    shippingAddress,
    paymentStatus: 'completed', // Auto-complete payment
  });

  // Update product stock
  product.stock -= quantity;
  product.sold += quantity;
  await product.save();

  // Transfer money to artisan's wallet
  const artisan = await User.findById(product.artisan);
  if (artisan) {
    artisan.walletBalance += totalPrice;
    await artisan.save();
  }

  // Create transaction record
  await Transaction.create({
    order: order._id,
    from: req.user._id,
    to: product.artisan,
    amount: totalPrice,
    type: 'purchase',
    status: 'completed',
    description: `Payment for ${product.title} (Qty: ${quantity})`,
  });

  const populatedOrder = await Order.findById(order._id)
    .populate('product', 'title media price')
    .populate('artisan', 'name');

  res.status(201).json({
    success: true,
    message: 'Order placed successfully! Payment transferred to artisan.',
    data: populatedOrder,
  });
});

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('product', 'title media price')
    .populate('artisan', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get artisan orders
// @route   GET /api/orders/artisan-orders
// @access  Private (Artisan only)
const getArtisanOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ artisan: req.user._id })
    .populate('product', 'title media price')
    .populate('buyer', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Artisan only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  order.status = status;
  await order.save();

  res.json({
    success: true,
    data: order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getArtisanOrders,
  updateOrderStatus,
};
