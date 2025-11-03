const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create product
// @route   POST /api/products
// @access  Private (Artisan only)
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, stock, media } = req.body;

  if (!title || !description || !price || !category) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (!media || media.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image or video');
  }

  const product = await Product.create({
    artisan: req.user._id,
    title,
    description,
    price,
    category,
    stock: stock || 1,
    media,
  });

  const populatedProduct = await Product.findById(product._id).populate('artisan', 'name');

  res.status(201).json({
    success: true,
    data: populatedProduct,
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, artisan } = req.query;
  
  let query = { isActive: true };
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (artisan) {
    query.artisan = artisan;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(query)
    .populate('artisan', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('artisan', 'name email');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Artisan only)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const { title, description, price, category, stock, isActive } = req.body;

  if (title) product.title = title;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (category) product.category = category;
  if (stock !== undefined) product.stock = stock;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();

  res.json({
    success: true,
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Artisan only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// @desc    Like/Unlike product
// @route   PUT /api/products/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const hasLiked = product.likes.includes(req.user._id);

  if (hasLiked) {
    product.likes = product.likes.filter(id => id.toString() !== req.user._id.toString());
    product.likesCount = product.likes.length;
    
    // Remove from user's liked and favorite products
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { 
        likedProducts: req.params.id,
        favoriteProducts: req.params.id 
      }
    });
  } else {
    product.likes.push(req.user._id);
    product.likesCount = product.likes.length;
    
    // Add to user's liked and favorite products
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { 
        likedProducts: req.params.id,
        favoriteProducts: req.params.id 
      }
    });
  }

  await product.save();

  res.json({
    success: true,
    liked: !hasLiked,
    likesCount: product.likesCount,
  });
});

// @desc    Get user's favorite products
// @route   GET /api/products/favorites
// @access  Private
const getFavoriteProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favoriteProducts',
    populate: {
      path: 'artisan',
      select: 'name email',
    },
  });

  res.json({
    success: true,
    count: user.favoriteProducts.length,
    data: user.favoriteProducts,
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleLike,
  getFavoriteProducts,
};
