const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Product = require('../models/Product');

// @desc    Get comments for a product
// @route   GET /api/comments/:productId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

// @desc    Add comment
// @route   POST /api/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { productId, content } = req.body;

  if (!productId || !content) {
    res.status(400);
    throw new Error('Please provide product ID and comment content');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const comment = await Comment.create({
    product: productId,
    user: req.user._id,
    content,
  });

  const populatedComment = await Comment.findById(comment._id).populate('user', 'name');

  res.status(201).json({
    success: true,
    data: populatedComment,
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Please provide comment content');
  }

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this comment');
  }

  comment.content = content;
  comment.isEdited = true;
  comment.editedAt = Date.now();
  await comment.save();

  const updatedComment = await Comment.findById(comment._id).populate('user', 'name');

  res.json({
    success: true,
    data: updatedComment,
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();

  res.json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
};
