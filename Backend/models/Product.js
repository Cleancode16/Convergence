const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: [
        'pottery',
        'weavery',
        'paintings',
        'tanjore_paintings',
        'puppetry',
        'dokra_jewellery',
        'meenakari',
        'kondapalli_bommalu',
        'ikkat',
        'mandala',
        'stationary',
        'others'
      ],
      required: [true, 'Please select a category'],
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      }
    }],
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 1,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
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

// Index for faster queries
productSchema.index({ artisan: 1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ likesCount: -1 });

module.exports = mongoose.model('Product', productSchema);
