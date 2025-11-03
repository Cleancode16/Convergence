const asyncHandler = require('express-async-handler');
const ArtisanProfile = require('../models/ArtisanProfile');
const User = require('../models/User');

// @desc    Get all artisans with profiles
// @route   GET /api/admin/artisans
// @access  Private (Admin only)
const getAllArtisans = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  
  let query = {};
  
  // Filter by verification status if provided
  if (status && status !== 'all') {
    query.verificationStatus = status;
  }
  
  const artisans = await ArtisanProfile.find(query)
    .populate('user', 'name email')
    .populate('verifiedBy', 'name')
    .sort({ createdAt: -1 });
  
  // Filter by search term if provided
  let filteredArtisans = artisans;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredArtisans = artisans.filter(artisan => 
      artisan.user.name.toLowerCase().includes(searchLower) ||
      artisan.user.email.toLowerCase().includes(searchLower) ||
      artisan.phoneNumber.includes(search) ||
      artisan.aadharNumber.includes(search)
    );
  }
  
  res.json({
    success: true,
    count: filteredArtisans.length,
    data: filteredArtisans,
  });
});

// @desc    Get single artisan profile
// @route   GET /api/admin/artisans/:id
// @access  Private (Admin only)
const getArtisanById = asyncHandler(async (req, res) => {
  const artisan = await ArtisanProfile.findById(req.params.id)
    .populate('user', 'name email role createdAt')
    .populate('verifiedBy', 'name email');
  
  if (!artisan) {
    res.status(404);
    throw new Error('Artisan profile not found');
  }
  
  res.json({
    success: true,
    data: artisan,
  });
});

// @desc    Verify artisan (mark as verified/expert)
// @route   PUT /api/admin/artisans/:id/verify
// @access  Private (Admin only)
const verifyArtisan = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  
  const artisan = await ArtisanProfile.findById(req.params.id);
  
  if (!artisan) {
    res.status(404);
    throw new Error('Artisan profile not found');
  }
  
  if (artisan.verificationStatus === 'verified') {
    res.status(400);
    throw new Error('Artisan is already verified');
  }
  
  artisan.verificationStatus = 'verified';
  artisan.isExpertVerified = true;
  artisan.verifiedBy = req.user._id;
  artisan.verifiedAt = Date.now();
  artisan.verificationNotes = notes || 'Verified as genuine artisan';
  
  await artisan.save();
  
  const updatedArtisan = await ArtisanProfile.findById(artisan._id)
    .populate('user', 'name email')
    .populate('verifiedBy', 'name');
  
  res.json({
    success: true,
    message: 'Artisan verified successfully',
    data: updatedArtisan,
  });
});

// @desc    Mark artisan as fraud
// @route   PUT /api/admin/artisans/:id/fraud
// @access  Private (Admin only)
const markAsFraud = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  
  if (!notes || notes.trim().length === 0) {
    res.status(400);
    throw new Error('Please provide reason for marking as fraud');
  }
  
  const artisan = await ArtisanProfile.findById(req.params.id);
  
  if (!artisan) {
    res.status(404);
    throw new Error('Artisan profile not found');
  }
  
  artisan.verificationStatus = 'fraud';
  artisan.isExpertVerified = false;
  artisan.verifiedBy = req.user._id;
  artisan.verifiedAt = Date.now();
  artisan.verificationNotes = notes;
  
  await artisan.save();
  
  const updatedArtisan = await ArtisanProfile.findById(artisan._id)
    .populate('user', 'name email')
    .populate('verifiedBy', 'name');
  
  res.json({
    success: true,
    message: 'Artisan marked as fraud',
    data: updatedArtisan,
  });
});

// @desc    Reject artisan verification
// @route   PUT /api/admin/artisans/:id/reject
// @access  Private (Admin only)
const rejectArtisan = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  
  if (!notes || notes.trim().length === 0) {
    res.status(400);
    throw new Error('Please provide reason for rejection');
  }
  
  const artisan = await ArtisanProfile.findById(req.params.id);
  
  if (!artisan) {
    res.status(404);
    throw new Error('Artisan profile not found');
  }
  
  artisan.verificationStatus = 'rejected';
  artisan.isExpertVerified = false;
  artisan.verifiedBy = req.user._id;
  artisan.verifiedAt = Date.now();
  artisan.verificationNotes = notes;
  
  await artisan.save();
  
  const updatedArtisan = await ArtisanProfile.findById(artisan._id)
    .populate('user', 'name email')
    .populate('verifiedBy', 'name');
  
  res.json({
    success: true,
    message: 'Artisan verification rejected',
    data: updatedArtisan,
  });
});

// @desc    Get verification statistics
// @route   GET /api/admin/artisans/stats
// @access  Private (Admin only)
const getArtisanStats = asyncHandler(async (req, res) => {
  const totalArtisans = await ArtisanProfile.countDocuments();
  const pendingVerification = await ArtisanProfile.countDocuments({ verificationStatus: 'pending' });
  const verified = await ArtisanProfile.countDocuments({ verificationStatus: 'verified' });
  const fraud = await ArtisanProfile.countDocuments({ verificationStatus: 'fraud' });
  const rejected = await ArtisanProfile.countDocuments({ verificationStatus: 'rejected' });
  
  res.json({
    success: true,
    data: {
      totalArtisans,
      pendingVerification,
      verified,
      fraud,
      rejected,
    },
  });
});

module.exports = {
  getAllArtisans,
  getArtisanById,
  verifyArtisan,
  markAsFraud,
  rejectArtisan,
  getArtisanStats,
};
