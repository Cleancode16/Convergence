const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const ArtStory = require('../models/ArtStory');
const User = require('../models/User');

// @desc    Generate art story using Gemini AI
// @route   POST /api/art-stories/generate
// @access  Private (Admin only)
const generateArtStory = asyncHandler(async (req, res) => {
  const { artForm } = req.body;

  if (!artForm) {
    res.status(400);
    throw new Error('Please provide an art form');
  }

  console.log('Generating story for:', artForm);

  // Check if story already exists
  const existingStory = await ArtStory.findOne({ artForm: { $regex: artForm, $options: 'i' } });
  if (existingStory) {
    res.status(400);
    throw new Error('Story for this art form already exists');
  }

  try {
    console.log('Initializing Gemini AI model...');
    const model = google('gemini-2.0-flash-exp'); // Using latest Gemini model

    const prompt = `You are an imaginative storyteller and art historian specializing in Indian traditional arts.

Create an engaging, educational, and beautifully written storybook about the Indian art form: "${artForm}".

Your storytelling should be:
- Poetic and expressive, using vivid sensory descriptions
- Educational yet captivating for all ages
- Rich in cultural context and emotional depth
- Include the artist's perspective and hidden meanings
- Connect the art to human experience and emotions

Generate a comprehensive JSON response with the following structure:
{
  "title": "A poetic and engaging title that captures the essence of ${artForm}",
  "introduction": "A captivating 3-4 paragraph introduction that sets the scene (time, place, emotional tone). Use rich sensory descriptions of colors, light, textures, sounds. Make readers feel transported to the origin of this art form.",
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "An evocative chapter title",
      "content": "4-5 paragraphs of immersive storytelling. Include: the setting, artisan's hands at work, the emotional journey, cultural significance, sensory details (smell of clay, sound of loom, touch of silk, colors dancing). Make it come alive.",
      "imagePrompt": "Detailed visual description for an illustration showing the scene"
    },
    {
      "chapterNumber": 2,
      "title": "Another meaningful chapter title",
      "content": "4-5 paragraphs continuing the narrative journey through this art form. Focus on techniques, materials, the community, generational wisdom passed down.",
      "imagePrompt": "Detailed visual description"
    },
    {
      "chapterNumber": 3,
      "title": "Chapter about traditions and meanings",
      "content": "4-5 paragraphs exploring the symbolism, patterns, stories woven into the art. The hidden meanings, spiritual connections, celebrations.",
      "imagePrompt": "Detailed visual description"
    },
    {
      "chapterNumber": 4,
      "title": "Chapter connecting past and present",
      "content": "4-5 paragraphs showing how the art lives today, master artisans keeping traditions alive, the bridge between heritage and modernity.",
      "imagePrompt": "Detailed visual description"
    }
  ],
  "history": "4-5 paragraphs of poetic historical narrative. Paint a vivid picture of origins - the time period, the landscape, the first artisans, how this art form emerged from necessity, beauty, or devotion. Use immersive language.",
  "importance": "3-4 paragraphs explaining why this art matters, written with emotional depth. Connect it to identity, heritage, human creativity, and cultural continuity.",
  "culturalSignificance": "3 paragraphs about the art's role in ceremonies, festivals, daily life, social fabric. Include emotional and spiritual dimensions.",
  "modernRelevance": "3 paragraphs showing how this ancient art speaks to modern life. Challenges artisans face, revival efforts, contemporary interpretations. End with hope and reflection.",
  "funFacts": [
    "A fascinating, lesser-known fact with vivid detail",
    "An intriguing story about a master artisan or technique",
    "A surprising connection or unusual tradition",
    "A poetic detail about materials or process",
    "An inspiring contemporary revival or innovation"
  ]
}

Remember:
- Use poetic realism and expressive language
- Include sensory details: colors, textures, sounds, smells, feelings
- Show the artisan's hands, heart, and heritage
- Create emotional resonance
- Make every sentence beautiful and meaningful
- End each section with reflection connecting to universal human experience

Return ONLY valid JSON, no markdown formatting.`;

    console.log('Calling Gemini API...');
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.8, // Higher creativity
      maxTokens: 4000, // More tokens for detailed responses
    });

    console.log('AI Response received, parsing...');

    // Parse AI response
    let storyData;
    try {
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      storyData = JSON.parse(cleanedText);
      console.log('Story data parsed successfully');
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      res.status(500);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Create placeholder cover image URL
    const coverImage = `https://source.unsplash.com/800x600/?indian,${artForm.replace(/\s/g, ',')},traditional,art`;

    console.log('Creating story in database...');
    // Create story
    const artStory = await ArtStory.create({
      title: storyData.title,
      artForm,
      coverImage,
      introduction: storyData.introduction,
      chapters: storyData.chapters.map(ch => ({
        ...ch,
        image: `https://source.unsplash.com/800x600/?indian,${artForm.replace(/\s/g, ',')},${ch.imagePrompt?.split(' ').slice(0, 3).join(',')}`,
      })),
      history: storyData.history,
      importance: storyData.importance,
      culturalSignificance: storyData.culturalSignificance,
      modernRelevance: storyData.modernRelevance,
      funFacts: storyData.funFacts,
    });

    console.log('Story created successfully:', artStory._id);

    res.status(201).json({
      success: true,
      message: 'Art story generated successfully',
      data: artStory,
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500);
    throw new Error(`Failed to generate art story: ${error.message}`);
  }
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
  generateArtStory,
  getAllStories,
  getStory,
  toggleLike,
  deleteStory,
};
