const mongoose = require('mongoose');

const artisanProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    artType: {
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
        'others',
      ],
      required: [true, 'Please select your art type'],
    },
    otherArtType: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    aadharNumber: {
      type: String,
      required: [true, 'Please provide Aadhar number'],
      unique: true,
      match: [/^[0-9]{12}$/, 'Please provide a valid 12-digit Aadhar number'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true,
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: {
        type: String,
        match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
      },
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'fraud', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    verificationNotes: {
      type: String,
      maxlength: [500, 'Verification notes cannot exceed 500 characters'],
    },
    isExpertVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Set profileComplete to true when all required fields are filled
artisanProfileSchema.pre('save', function (next) {
  if (this.artType && this.phoneNumber && this.aadharNumber) {
    this.profileComplete = true;
  }

  // Set isExpertVerified based on verification status
  if (this.verificationStatus === 'verified') {
    this.isExpertVerified = true;
  } else {
    this.isExpertVerified = false;
  }

  next();
});

module.exports = mongoose.model('ArtisanProfile', artisanProfileSchema);
