const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get AI-powered recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user's interaction data
  const user = await User.findById(userId)
    .populate('likedProducts')
    .populate('purchasedProducts')
    .populate('viewedProducts.product');

  // Get all products
  const allProducts = await Product.find({ isActive: true })
    .populate('artisan', 'name')
    .lean();

  // Prepare user preferences
  const likedCategories = user.likedProducts?.map(p => p.category) || [];
  const purchasedCategories = user.purchasedProducts?.map(p => p.category) || [];
  const viewedCategories = user.viewedProducts?.map(v => v.product?.category).filter(Boolean) || [];

  const userPreferences = {
    likedCategories: [...new Set(likedCategories)],
    purchasedCategories: [...new Set(purchasedCategories)],
    viewedCategories: [...new Set(viewedCategories)],
  };

  const productsData = allProducts.map(p => ({
    id: p._id,
    title: p.title,
    category: p.category,
    price: p.price,
    likesCount: p.likesCount,
  }));

  try {
    const model = google('gemini-2.0-flash-exp');

    const prompt = `You are an AI recommendation system for handicraft products.

User Profile:
- Liked Categories: ${userPreferences.likedCategories.join(', ') || 'None'}
- Purchased Categories: ${userPreferences.purchasedCategories.join(', ') || 'None'}
- Viewed Categories: ${userPreferences.viewedCategories.join(', ') || 'None'}

Available Products:
${JSON.stringify(productsData, null, 2)}

Based on the user's interaction history, recommend the TOP 10 most relevant products.

PRIORITIZE:
1. Categories the user has purchased from (highest priority)
2. Categories the user has liked
3. Categories the user has viewed
4. Popular products (high likes count)
5. Variety in recommendations

Return ONLY a JSON array of product IDs in order of relevance:
["productId1", "productId2", "productId3", ...]

Return ONLY the JSON array, no markdown, no explanation.`;

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    });

    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recommendedIds = JSON.parse(cleanedText);

    // Get full product details
    const recommendedProducts = await Product.find({
      _id: { $in: recommendedIds },
    })
      .populate('artisan', 'name email')
      .lean();

    // Sort according to AI recommendation order
    const sortedRecommendations = recommendedIds
      .map(id => recommendedProducts.find(p => p._id.toString() === id))
      .filter(Boolean);

    res.json({
      success: true,
      count: sortedRecommendations.length,
      data: sortedRecommendations,
    });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    
    // Fallback: recommend based on liked and purchased categories
    const preferredCategories = [...new Set([...userPreferences.purchasedCategories, ...userPreferences.likedCategories])];
    
    let fallbackRecommendations = [];
    
    if (preferredCategories.length > 0) {
      fallbackRecommendations = allProducts
        .filter(p => preferredCategories.includes(p.category))
        .slice(0, 10);
    }
    
    if (fallbackRecommendations.length === 0) {
      fallbackRecommendations = allProducts
        .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
        .slice(0, 10);
    }
    
    res.json({
      success: true,
      count: fallbackRecommendations.length,
      data: fallbackRecommendations,
      fallback: true,
    });
  }
});

// @desc    Track product view
// @route   POST /api/recommendations/track-view
// @access  Private
const trackProductView = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const product = await Product.findById(productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update user's viewed products
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { viewedProducts: { product: productId } }, // Remove old entry if exists
    }
  );

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        viewedProducts: {
          $each: [{ product: productId, viewedAt: new Date() }],
          $position: 0,
          $slice: 50, // Keep only last 50 viewed products
        },
      },
    }
  );

  res.json({
    success: true,
    message: 'Product view tracked',
  });
});

module.exports = {
  getRecommendations,
  trackProductView,
};
