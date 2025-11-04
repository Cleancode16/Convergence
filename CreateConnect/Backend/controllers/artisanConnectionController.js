const asyncHandler = require('express-async-handler');
const Connection = require('../models/Connection');
const NgoProfile = require('../models/NgoProfile');

// @desc    Get connection requests for artisan
// @route   GET /api/artisan/connection-requests
// @access  Private (Artisan only)
const getConnectionRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  let query = { artisan: req.user._id };
  
  if (status && status !== 'all') {
    query.status = status;
  }

  const connections = await Connection.find(query)
    .populate('ngo', 'name email')
    .sort({ createdAt: -1 });

  // Fetch NGO profiles for additional details
  const connectionsWithNgoDetails = await Promise.all(
    connections.map(async (connection) => {
      const ngoProfile = await NgoProfile.findOne({ user: connection.ngo._id });
      return {
        ...connection.toObject(),
        ngoProfile: ngoProfile || null
      };
    })
  );

  res.json({
    success: true,
    count: connectionsWithNgoDetails.length,
    data: connectionsWithNgoDetails,
  });
});

// @desc    Accept connection request
// @route   PUT /api/artisan/connection-requests/:id/accept
// @access  Private (Artisan only)
const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const connection = await Connection.findOne({
    _id: req.params.id,
    artisan: req.user._id,
  });

  if (!connection) {
    res.status(404);
    throw new Error('Connection request not found');
  }

  if (connection.status !== 'pending') {
    res.status(400);
    throw new Error('Connection request already processed');
  }

  connection.status = 'accepted';
  await connection.save();

  const updatedConnection = await Connection.findById(connection._id)
    .populate('ngo', 'name email');

  res.json({
    success: true,
    message: 'Connection request accepted',
    data: updatedConnection,
  });
});

// @desc    Reject connection request
// @route   PUT /api/artisan/connection-requests/:id/reject
// @access  Private (Artisan only)
const rejectConnectionRequest = asyncHandler(async (req, res) => {
  const connection = await Connection.findOne({
    _id: req.params.id,
    artisan: req.user._id,
  });

  if (!connection) {
    res.status(404);
    throw new Error('Connection request not found');
  }

  if (connection.status !== 'pending') {
    res.status(400);
    throw new Error('Connection request already processed');
  }

  connection.status = 'rejected';
  await connection.save();

  const updatedConnection = await Connection.findById(connection._id)
    .populate('ngo', 'name email');

  res.json({
    success: true,
    message: 'Connection request rejected',
    data: updatedConnection,
  });
});

// @desc    Get connected NGOs (accepted connections)
// @route   GET /api/artisan/connections
// @access  Private (Artisan only)
const getConnectedNgos = asyncHandler(async (req, res) => {
  const connections = await Connection.find({
    artisan: req.user._id,
    status: 'accepted'
  })
    .populate('ngo', 'name email')
    .sort({ updatedAt: -1 });

  // Fetch NGO profiles for additional details
  const connectionsWithNgoDetails = await Promise.all(
    connections.map(async (connection) => {
      const ngoProfile = await NgoProfile.findOne({ user: connection.ngo._id });
      return {
        ...connection.toObject(),
        ngoProfile: ngoProfile || null
      };
    })
  );

  res.json({
    success: true,
    count: connectionsWithNgoDetails.length,
    data: connectionsWithNgoDetails,
  });
});

module.exports = {
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectedNgos,
};
