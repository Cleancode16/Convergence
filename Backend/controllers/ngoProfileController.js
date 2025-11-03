const asyncHandler = require('express-async-handler');
const NgoProfile = require('../models/NgoProfile');

// @desc    Get NGO profile
// @route   GET /api/ngo/profile
// @access  Private (NGO only)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await NgoProfile.findOne({ user: req.user._id }).populate(
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

// @desc    Create or Update NGO profile
// @route   POST /api/ngo/profile
// @access  Private (NGO only)
const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const {
    ngoType,
    otherNgoType,
    registrationNumber,
    phoneNumber,
    interestedArtDomains,
    description,
    yearEstablished,
    address,
    website,
  } = req.body;

  // Validation
  if (!ngoType || !registrationNumber || !phoneNumber || !interestedArtDomains) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Validate phone number format
  if (!/^[0-9]{10}$/.test(phoneNumber)) {
    res.status(400);
    throw new Error('Please provide a valid 10-digit phone number');
  }

  // Validate art domains
  if (!Array.isArray(interestedArtDomains) || interestedArtDomains.length === 0) {
    res.status(400);
    throw new Error('Please select at least one art domain');
  }

  // If ngoType is 'others', otherNgoType is required
  if (ngoType === 'others' && !otherNgoType) {
    res.status(400);
    throw new Error('Please specify your NGO type');
  }

  const profileFields = {
    user: req.user._id,
    ngoType,
    registrationNumber,
    phoneNumber,
    interestedArtDomains,
  };

  if (otherNgoType) profileFields.otherNgoType = otherNgoType;
  if (description) profileFields.description = description;
  if (yearEstablished) profileFields.yearEstablished = yearEstablished;
  if (address) profileFields.address = address;
  if (website) profileFields.website = website;

  // Check if profile exists
  let profile = await NgoProfile.findOne({ user: req.user._id });

  if (profile) {
    // Check if registration number is being changed and if it already exists
    if (registrationNumber !== profile.registrationNumber) {
      const regExists = await NgoProfile.findOne({
        registrationNumber,
        user: { $ne: req.user._id },
      });
      if (regExists) {
        res.status(400);
        throw new Error('Registration number already exists');
      }
    }

    // Update existing profile
    profile = await NgoProfile.findOneAndUpdate(
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
    // Check if registration number already exists
    const regExists = await NgoProfile.findOne({ registrationNumber });
    if (regExists) {
      res.status(400);
      throw new Error('Registration number already exists');
    }

    // Create new profile
    profile = await NgoProfile.create(profileFields);
    profile = await NgoProfile.findById(profile._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile,
    });
  }
});

// @desc    Check if profile is complete
// @route   GET /api/ngo/profile/status
// @access  Private (NGO only)
const getProfileStatus = asyncHandler(async (req, res) => {
  const profile = await NgoProfile.findOne({ user: req.user._id });

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
