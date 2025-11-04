const mongoose = require('mongoose');

const artistPostSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One post per artisan
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide your specialization'],
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
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
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
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
artistPostSchema.index({ artisan: 1 });
artistPostSchema.index({ likesCount: -1 });
artistPostSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('ArtistPost', artistPostSchema);
