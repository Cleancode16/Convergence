const asyncHandler = require('express-async-handler');
const ArtStory = require('../models/ArtStory');

// @desc    Create art story with storybook link
// @route   POST /api/art-stories
// @access  Private (Admin only)
const createArtStory = asyncHandler(async (req, res) => {
  const { artForm, title, storybookLink, description } = req.body;

  if (!artForm || !title || !storybookLink) {
    res.status(400);
    throw new Error('Please provide art form, title, and storybook link');
  }

  // Check if story already exists
  const existingStory = await ArtStory.findOne({ artForm: { $regex: artForm, $options: 'i' } });
  if (existingStory) {
    res.status(400);
    throw new Error('Story for this art form already exists');
  }

  // Use the link directly - no conversion needed for Gemini storybook links
  const artStory = await ArtStory.create({
    title,
    artForm,
    storybookLink: storybookLink,
    description: description || `Learn about the traditional Indian art form of ${artForm}`,
    coverImage: `https://source.unsplash.com/800x600/?indian,${artForm.replace(/\s/g, ',')}`,
    introduction: description || `Discover the rich heritage and techniques of ${artForm}`,
    history: description || `The history of ${artForm}`,
    importance: description || `The importance of ${artForm}`,
    generatedBy: 'Admin Manual Entry',
  });

  res.status(201).json({
    success: true,
    message: 'Art story created successfully',
    data: artStory,
  });
});

// @desc    Update art story
// @route   PUT /api/art-stories/:id
// @access  Private (Admin only)
const updateArtStory = asyncHandler(async (req, res) => {
  const { title, storybookLink, description } = req.body;

  const story = await ArtStory.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  story.title = title || story.title;
  story.storybookLink = storybookLink || story.storybookLink;
  story.description = description || story.description;
  story.introduction = description || story.introduction;

  const updatedStory = await story.save();

  res.json({
    success: true,
    message: 'Art story updated successfully',
    data: updatedStory,
  });
});

// @desc    Get all art stories
// @route   GET /api/art-stories
// @access  Public
const getAllStories = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let query = { isActive: true };
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { artForm: { $regex: search, $options: 'i' } },
    ];
  }

  const stories = await ArtStory.find(query)
    .sort({ likesCount: -1, createdAt: -1 })
    .select('-chapters');

  res.json({
    success: true,
    count: stories.length,
    data: stories,
  });
});

// @desc    Get single art story
// @route   GET /api/art-stories/:id
// @access  Public
const getStory = asyncHandler(async (req, res) => {
  const story = await ArtStory.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  // Increment views
  story.views += 1;
  await story.save();

  res.json({
    success: true,
    data: story,
  });
});

// @desc    Like/Unlike story
// @route   PUT /api/art-stories/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const story = await ArtStory.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  const hasLiked = story.likes.includes(req.user._id);

  if (hasLiked) {
    story.likes = story.likes.filter(id => id.toString() !== req.user._id.toString());
    story.likesCount = story.likes.length;
  } else {
    story.likes.push(req.user._id);
    story.likesCount = story.likes.length;
  }

  await story.save();

  res.json({
    success: true,
    liked: !hasLiked,
    likesCount: story.likesCount,
  });
});

// @desc    Delete story
// @route   DELETE /api/art-stories/:id
// @access  Private (Admin only)
const deleteStory = asyncHandler(async (req, res) => {
  const story = await ArtStory.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  await story.deleteOne();

  res.json({
    success: true,
    message: 'Story deleted successfully',
  });
});

module.exports = {
  createArtStory,
  updateArtStory,
  getAllStories,
  getStory,
  toggleLike,
  deleteStory,
};
