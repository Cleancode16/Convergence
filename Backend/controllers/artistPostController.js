const asyncHandler = require('express-async-handler');
const ArtistPost = require('../models/ArtistPost');
const User = require('../models/User');

// @desc    Create or update artist post
// @route   POST /api/artist-posts
// @access  Private (Artisan only)
const createOrUpdatePost = asyncHandler(async (req, res) => {
  const { title, description, specialization, experience, media } = req.body;

  if (!title || !description || !specialization) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if artisan already has a post
  let post = await ArtistPost.findOne({ artisan: req.user._id });

  if (post) {
    // Update existing post
    post.title = title;
    post.description = description;
    post.specialization = specialization;
    post.experience = experience || '';
    if (media && media.length > 0) {
      post.media = media;
    }
    await post.save();
  } else {
    // Create new post
    post = await ArtistPost.create({
      artisan: req.user._id,
      title,
      description,
      specialization,
      experience: experience || '',
      media: media || [],
    });
  }

  const populatedPost = await ArtistPost.findById(post._id).populate('artisan', 'name email');

  res.status(post.isNew ? 201 : 200).json({
    success: true,
    message: post.isNew ? 'Post created successfully' : 'Post updated successfully',
    data: populatedPost,
  });
});

// @desc    Get all artist posts
// @route   GET /api/artist-posts
// @access  Public
const getAllPosts = asyncHandler(async (req, res) => {
  const { search, specialization } = req.query;
  
  let query = { isActive: true };
  
  // Semantic search - search in multiple fields
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { specialization: searchRegex },
      { experience: searchRegex },
    ];
  }
  
  // Filter by specialization
  if (specialization && specialization !== 'all') {
    query.specialization = { $regex: specialization, $options: 'i' };
  }

  const posts = await ArtistPost.find(query)
    .populate('artisan', 'name email')
    .sort({ likesCount: -1, createdAt: -1 });

  res.json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @desc    Get single artist post
// @route   GET /api/artist-posts/:id
// @access  Public
const getPost = asyncHandler(async (req, res) => {
  const post = await ArtistPost.findById(req.params.id)
    .populate('artisan', 'name email');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.json({
    success: true,
    data: post,
  });
});

// @desc    Get my artist post
// @route   GET /api/artist-posts/my-post
// @access  Private (Artisan only)
const getMyPost = asyncHandler(async (req, res) => {
  const post = await ArtistPost.findOne({ artisan: req.user._id })
    .populate('artisan', 'name email');

  res.json({
    success: true,
    data: post,
  });
});

// @desc    Delete artist post
// @route   DELETE /api/artist-posts/:id
// @access  Private (Artisan only)
const deletePost = asyncHandler(async (req, res) => {
  const post = await ArtistPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.artisan.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }

  await post.deleteOne();

  res.json({
    success: true,
    message: 'Post deleted successfully',
  });
});

// @desc    Like/Unlike artist post
// @route   PUT /api/artist-posts/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const post = await ArtistPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const hasLiked = post.likes.includes(req.user._id);

  if (hasLiked) {
    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    post.likesCount = post.likes.length;
    
    // Remove from user's liked posts
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { likedPosts: req.params.id }
    });
  } else {
    post.likes.push(req.user._id);
    post.likesCount = post.likes.length;
    
    // Add to user's liked posts
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likedPosts: req.params.id }
    });
  }

  await post.save();

  res.json({
    success: true,
    liked: !hasLiked,
    likesCount: post.likesCount,
  });
});

// @desc    Add/Remove favorite artist
// @route   PUT /api/artist-posts/:artistId/favorite
// @access  Private
const toggleFavorite = asyncHandler(async (req, res) => {
  const artistId = req.params.artistId;
  const user = await User.findById(req.user._id);

  if (!user.favoriteArtists) {
    user.favoriteArtists = [];
  }

  const isFavorite = user.favoriteArtists.includes(artistId);

  if (isFavorite) {
    user.favoriteArtists = user.favoriteArtists.filter(id => id.toString() !== artistId);
  } else {
    user.favoriteArtists.push(artistId);
  }

  await user.save();

  res.json({
    success: true,
    isFavorite: !isFavorite,
    message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
  });
});

// @desc    Get favorite artists
// @route   GET /api/artist-posts/favorites/my-favorites
// @access  Private
const getFavoriteArtists = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favoriteArtists', 'name email');

  const favoritePosts = await ArtistPost.find({
    artisan: { $in: user.favoriteArtists || [] },
    isActive: true,
  }).populate('artisan', 'name email');

  res.json({
    success: true,
    count: favoritePosts.length,
    data: favoritePosts,
  });
});

module.exports = {
  createOrUpdatePost,
  getAllPosts,
  getPost,
  getMyPost,
  deletePost,
  toggleLike,
  toggleFavorite,
  getFavoriteArtists,
};
