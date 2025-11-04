const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false, // Make it optional for donations
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: [
        'purchase',
        'refund',
        'withdrawal',
        'donation',
        'workshop_payment',
      ], // Add donation and workshop_payment
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    description: {
      type: String,
    },
    // Add optional reference for donations
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ from: 1, createdAt: -1 });
transactionSchema.index({ to: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
