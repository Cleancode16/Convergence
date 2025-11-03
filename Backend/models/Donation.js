const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ ngo: 1, createdAt: -1 });
donationSchema.index({ donor: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
