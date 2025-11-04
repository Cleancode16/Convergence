const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Connection = require('../models/Connection');

// @desc    Get messages for a connection
// @route   GET /api/messages/:connectionId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { connectionId } = req.params;
  
  // Verify connection exists and user is part of it
  const connection = await Connection.findById(connectionId);
  
  if (!connection) {
    res.status(404);
    throw new Error('Connection not found');
  }
  
  // Check if user is part of this connection
  if (connection.ngo.toString() !== req.user._id.toString() && 
      connection.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view these messages');
  }
  
  const messages = await Message.find({
    connection: connectionId,
    isDeleted: false,
  })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: 1 });
  
  // Mark messages as read
  await Message.updateMany(
    {
      connection: connectionId,
      receiver: req.user._id,
      readBy: { $ne: req.user._id }
    },
    {
      $addToSet: { readBy: req.user._id }
    }
  );
  
  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { connectionId, content } = req.body;
  
  if (!connectionId || !content) {
    res.status(400);
    throw new Error('Please provide connection ID and message content');
  }
  
  // Verify connection exists and is accepted
  const connection = await Connection.findById(connectionId);
  
  if (!connection) {
    res.status(404);
    throw new Error('Connection not found');
  }
  
  if (connection.status !== 'accepted') {
    res.status(403);
    throw new Error('Can only send messages to accepted connections');
  }
  
  // Determine sender and receiver
  let receiver;
  if (connection.ngo.toString() === req.user._id.toString()) {
    receiver = connection.artisan;
  } else if (connection.artisan.toString() === req.user._id.toString()) {
    receiver = connection.ngo;
  } else {
    res.status(403);
    throw new Error('Not authorized to send messages in this connection');
  }
  
  const message = await Message.create({
    connection: connectionId,
    sender: req.user._id,
    receiver,
    content,
  });
  
  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name')
    .populate('receiver', 'name');
  
  res.status(201).json({
    success: true,
    data: populatedMessage,
  });
});

// @desc    Edit a message
// @route   PUT /api/messages/:id
// @access  Private
const editMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    res.status(400);
    throw new Error('Please provide message content');
  }
  
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  
  // Only sender can edit
  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this message');
  }
  
  if (message.isDeleted) {
    res.status(400);
    throw new Error('Cannot edit deleted message');
  }
  
  message.content = content;
  message.isEdited = true;
  message.editedAt = Date.now();
  await message.save();
  
  const updatedMessage = await Message.findById(message._id)
    .populate('sender', 'name')
    .populate('receiver', 'name');
  
  res.json({
    success: true,
    data: updatedMessage,
  });
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  
  // Only sender can delete
  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this message');
  }
  
  message.isDeleted = true;
  message.deletedAt = Date.now();
  await message.save();
  
  res.json({
    success: true,
    message: 'Message deleted',
  });
});

module.exports = {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
};
