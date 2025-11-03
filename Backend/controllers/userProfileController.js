const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update allowed fields
  user.name = req.body.name || user.name;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;

  // Update address
  if (req.body.address) {
    user.address = {
      street: req.body.address.street || user.address?.street,
      city: req.body.address.city || user.address?.city,
      state: req.body.address.state || user.address?.state,
      pincode: req.body.address.pincode || user.address?.pincode,
      country: req.body.address.country || user.address?.country || 'India',
    };
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      dateOfBirth: updatedUser.dateOfBirth,
    },
  });
});

// @desc    Check if profile is complete
// @route   GET /api/user/profile/status
// @access  Private
const getProfileStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isComplete = !!(
    user.phoneNumber &&
    user.address?.street &&
    user.address?.city &&
    user.address?.state &&
    user.address?.pincode
  );

  res.json({
    success: true,
    data: {
      isComplete,
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
    },
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getProfileStatus,
};
