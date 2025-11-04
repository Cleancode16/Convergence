const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'artisan', 'ngo', 'admin'],
      default: 'user',
      required: [true, 'Please specify a role'],
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: [0, 'Wallet balance cannot be negative'],
    },
    favoriteArtists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    favoriteProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    likedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    likedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtistPost',
    }],
    viewedProducts: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      }
    }],
    purchasedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    // Add profile information
    phoneNumber: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
      },
      country: {
        type: String,
        default: 'India',
      },
    },
    profileImage: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
