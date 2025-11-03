const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    artForm: {
      type: String,
      required: true,
    },
    images: [{
      url: String,
      public_id: String,
    }],
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSlots: {
      type: Number,
      required: true,
    },
    enrolledUsers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
    }],
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

workshopSchema.index({ artForm: 1, date: 1, status: 1 });
workshopSchema.index({ artisan: 1 });

module.exports = mongoose.model('Workshop', workshopSchema);
