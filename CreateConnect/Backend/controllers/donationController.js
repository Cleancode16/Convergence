const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');
const User = require('../models/User');
const NGOProfile = require('../models/NgoProfile'); // Use consistent naming
const Transaction = require('../models/Transaction');

// @desc    Create donation
// @route   POST /api/donations
// @access  Private
const createDonation = asyncHandler(async (req, res) => {
  const { ngoId, amount, message } = req.body;

  if (!ngoId || !amount) {
    res.status(400);
    throw new Error('Please provide NGO ID and amount');
  }

  if (amount < 1) {
    res.status(400);
    throw new Error('Minimum donation amount is ₹1');
  }

  // Verify NGO exists
  const ngo = await User.findById(ngoId);
  if (!ngo || ngo.role !== 'ngo') {
    res.status(404);
    throw new Error('NGO not found');
  }

  // Create donation
  const donation = await Donation.create({
    ngo: ngoId,
    donor: req.user._id,
    amount,
    message: message || '',
    status: 'completed',
  });

  // Update NGO wallet
  if (ngo.walletBalance === undefined || ngo.walletBalance === null) {
    ngo.walletBalance = 0;
  }
  ngo.walletBalance = Number(ngo.walletBalance) + Number(amount);
  await ngo.save();

  // Update NGO profile
  const ngoProfile = await NGOProfile.findOne({ user: ngoId });
  if (ngoProfile) {
    ngoProfile.totalFundsRaised = (ngoProfile.totalFundsRaised || 0) + amount;
    
    // Count unique donors
    const uniqueDonors = await Donation.distinct('donor', { ngo: ngoId });
    ngoProfile.donorsCount = uniqueDonors.length;
    
    await ngoProfile.save();
  }

  // Create transaction record
  await Transaction.create({
    from: req.user._id,
    to: ngoId,
    amount,
    type: 'donation',
    status: 'completed',
    description: `Donation to ${ngo.name}`,
    donation: donation._id, // Add donation reference
  });

  const populatedDonation = await Donation.findById(donation._id)
    .populate('donor', 'name email')
    .populate('ngo', 'name email');

  res.status(201).json({
    success: true,
    message: `Donation of ₹${amount} sent successfully!`,
    data: populatedDonation,
  });
});

// @desc    Get NGO donations
// @route   GET /api/donations/ngo
// @access  Private (NGO only)
const getNGODonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ ngo: req.user._id })
    .populate('donor', 'name email')
    .sort({ createdAt: -1 });

  // Calculate stats
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const uniqueDonors = [...new Set(donations.map(d => d.donor._id.toString()))].length;

  res.json({
    success: true,
    count: donations.length,
    stats: {
      totalAmount,
      uniqueDonors,
      averageDonation: donations.length > 0 ? totalAmount / donations.length : 0,
    },
    data: donations,
  });
});

// @desc    Get user donations
// @route   GET /api/donations/my
// @access  Private
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ donor: req.user._id })
    .populate('ngo', 'name email')
    .sort({ createdAt: -1 });

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  res.json({
    success: true,
    count: donations.length,
    totalDonated,
    data: donations,
  });
});

// @desc    Get all NGOs
// @route   GET /api/donations/ngos
// @access  Public
const getAllNGOs = asyncHandler(async (req, res) => {
  const ngos = await User.find({ role: 'ngo' }).select('name email');
  
  const ngosWithProfiles = await Promise.all(
    ngos.map(async (ngo) => {
      const profile = await NGOProfile.findOne({ user: ngo._id });
      return {
        _id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        profile: profile || null,
      };
    })
  );

  res.json({
    success: true,
    count: ngosWithProfiles.length,
    data: ngosWithProfiles,
  });
});

// @desc    Get single NGO details
// @route   GET /api/donations/ngos/:id
// @access  Public
const getNGODetails = asyncHandler(async (req, res) => {
  console.log('Fetching NGO details for ID:', req.params.id); // Debug log
  
  const ngo = await User.findById(req.params.id).select('name email walletBalance role');
  
  if (!ngo) {
    res.status(404);
    throw new Error('NGO not found');
  }
  
  if (ngo.role !== 'ngo') {
    res.status(404);
    throw new Error('This user is not an NGO');
  }

  const profile = await NGOProfile.findOne({ user: req.params.id });
  console.log('NGO Profile found:', profile ? 'Yes' : 'No'); // Debug log
  
  // Get recent donations
  const recentDonations = await Donation.find({ ngo: req.params.id })
    .populate('donor', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  console.log('Recent donations count:', recentDonations.length); // Debug log

  res.json({
    success: true,
    data: {
      _id: ngo._id,
      name: ngo.name,
      email: ngo.email,
      profile: profile || null,
      recentDonations,
    },
  });
});

module.exports = {
  createDonation,
  getNGODonations,
  getMyDonations,
  getAllNGOs,
  getNGODetails,
};
