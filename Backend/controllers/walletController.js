const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
const getBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('walletBalance');

  res.json({
    success: true,
    data: {
      balance: user.walletBalance || 0,
    },
  });
});

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ from: req.user._id }, { to: req.user._id }],
  })
    .populate('from', 'name')
    .populate('to', 'name')
    .populate('order')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// @desc    Get earnings (for artisans)
// @route   GET /api/wallet/earnings
// @access  Private (Artisan only)
const getEarnings = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    to: req.user._id,
    type: 'purchase',
    status: 'completed',
  })
    .populate('from', 'name')
    .populate({
      path: 'order',
      populate: {
        path: 'product',
        select: 'title'
      }
    })
    .sort({ createdAt: -1 });

  const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);

  res.json({
    success: true,
    data: {
      totalEarnings,
      currentBalance: req.user.walletBalance || 0,
      transactions,
    },
  });
});

module.exports = {
  getBalance,
  getTransactions,
  getEarnings,
};
