const asyncHandler = require('express-async-handler');
const Connection = require('../models/Connection');
const ArtisanProfile = require('../models/ArtisanProfile');

// @desc    Send connection request to artisan
// @route   POST /api/ngo/connections
// @access  Private (NGO only)
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const { artisanId, message, purpose } = req.body;

  if (!artisanId) {
    res.status(400);
    throw new Error('Please provide artisan ID');
  }

  // Check if artisan exists
  const artisanProfile = await ArtisanProfile.findOne({ user: artisanId });
  
  if (!artisanProfile) {
    res.status(404);
    throw new Error('Artisan not found');
  }

  // Check if connection already exists
  const existingConnection = await Connection.findOne({
    ngo: req.user._id,
    artisan: artisanId,
  });

  if (existingConnection) {
    res.status(400);
    throw new Error('Connection request already sent');
  }

  const connection = await Connection.create({
    ngo: req.user._id,
    artisan: artisanId,
    artisanProfile: artisanProfile._id,
    message: message || 'Would like to connect with you',
    purpose,
  });

  const populatedConnection = await Connection.findById(connection._id)
    .populate('artisan', 'name email')
    .populate('artisanProfile', 'artType phoneNumber');

  res.status(201).json({
    success: true,
    message: 'Connection request sent successfully',
    data: populatedConnection,
  });
});

// @desc    Get all connections for NGO
// @route   GET /api/ngo/connections
// @access  Private (NGO only)
const getNgoConnections = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  let query = { ngo: req.user._id };
  
  if (status && status !== 'all') {
    query.status = status;
  }

  const connections = await Connection.find(query)
    .populate('artisan', 'name email')
    .populate('artisanProfile', 'artType phoneNumber bio experience address')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: connections.length,
    data: connections,
  });
});

// @desc    Cancel connection request
// @route   DELETE /api/ngo/connections/:id
// @access  Private (NGO only)
const cancelConnectionRequest = asyncHandler(async (req, res) => {
  const connection = await Connection.findOne({
    _id: req.params.id,
    ngo: req.user._id,
  });

  if (!connection) {
    res.status(404);
    throw new Error('Connection not found');
  }

  await connection.deleteOne();

  res.json({
    success: true,
    message: 'Connection request cancelled',
  });
});

module.exports = {
  sendConnectionRequest,
  getNgoConnections,
  cancelConnectionRequest,
};
