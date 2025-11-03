const asyncHandler = require('express-async-handler');
const ArtisanProfile = require('../models/ArtisanProfile');
const User = require('../models/User');

// @desc    Get artisan profile
// @route   GET /api/artisan/profile
// @access  Private (Artisan only)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await ArtisanProfile.findOne({ user: req.user._id }).populate(
    'user',
    'name email'
  );

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json({
    success: true,
    data: profile,
  });
});

// @desc    Create or Update artisan profile
// @route   POST /api/artisan/profile
// @access  Private (Artisan only)
const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const {
    artType,
    otherArtType,
    phoneNumber,
    aadharNumber,
    bio,
    experience,
    address,
  } = req.body;

  // Validation
  if (!artType || !phoneNumber || !aadharNumber) {
    res.status(400);
    throw new Error('Please provide art type, phone number, and Aadhar number');
  }

  // Validate phone number format
  if (!/^[0-9]{10}$/.test(phoneNumber)) {
    res.status(400);
    throw new Error('Please provide a valid 10-digit phone number');
  }

  // Validate Aadhar number format
  if (!/^[0-9]{12}$/.test(aadharNumber)) {
    res.status(400);
    throw new Error('Please provide a valid 12-digit Aadhar number');
  }

  // If artType is 'others', otherArtType is required
  if (artType === 'others' && !otherArtType) {
    res.status(400);
    throw new Error('Please specify your art type');
  }

  const profileFields = {
    user: req.user._id,
    artType,
    phoneNumber,
    aadharNumber,
  };

  if (otherArtType) profileFields.otherArtType = otherArtType;
  if (bio) profileFields.bio = bio;
  if (experience) profileFields.experience = experience;
  if (address) profileFields.address = address;

  // Check if profile exists
  let profile = await ArtisanProfile.findOne({ user: req.user._id });

  if (profile) {
    // Check if Aadhar number is being changed and if it already exists for another user
    if (aadharNumber !== profile.aadharNumber) {
      const aadharExists = await ArtisanProfile.findOne({
        aadharNumber,
        user: { $ne: req.user._id },
      });
      if (aadharExists) {
        res.status(400);
        throw new Error('Aadhar number already registered');
      }
    }

    // Update existing profile
    profile = await ArtisanProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } else {
    // Check if Aadhar number already exists
    const aadharExists = await ArtisanProfile.findOne({ aadharNumber });
    if (aadharExists) {
      res.status(400);
      throw new Error('Aadhar number already registered');
    }

    // Create new profile
    profile = await ArtisanProfile.create(profileFields);
    profile = await ArtisanProfile.findById(profile._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile,
    });
  }
});

// @desc    Check if profile is complete
// @route   GET /api/artisan/profile/status
// @access  Private (Artisan only)
const getProfileStatus = asyncHandler(async (req, res) => {
  const profile = await ArtisanProfile.findOne({ user: req.user._id });

  res.json({
    success: true,
    data: {
      profileExists: !!profile,
      profileComplete: profile ? profile.profileComplete : false,
    },
  });
});

module.exports = {
  getProfile,
  createOrUpdateProfile,
  getProfileStatus,
};
