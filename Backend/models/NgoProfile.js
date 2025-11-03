const mongoose = require('mongoose');

const ngoProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    ngoType: {
      type: String,
      enum: ['trust', 'society', 'section_8_company', 'others'],
      required: [true, 'Please select NGO type'],
    },
    otherNgoType: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide registration number'],
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    interestedArtDomains: {
      type: [String],
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
        'all',
      ],
      required: [true, 'Please select at least one art domain'],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Please select at least one art domain',
      },
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      trim: true,
    },
    yearEstablished: {
      type: Number,
      min: [1800, 'Invalid year'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
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
    website: {
      type: String,
      trim: true,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Set profileComplete to true when all required fields are filled
ngoProfileSchema.pre('save', function (next) {
  if (
    this.ngoType &&
    this.registrationNumber &&
    this.phoneNumber &&
    this.interestedArtDomains &&
    this.interestedArtDomains.length > 0
  ) {
    this.profileComplete = true;
  }
  next();
});

module.exports = mongoose.model('NgoProfile', ngoProfileSchema);
