const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get AI-powered product recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('likedProducts', 'title category price')
    .populate('purchasedProducts', 'title category price')
    .populate('viewedProducts.product', 'title category price')
    .populate({
      path: 'favoriteArtists',
      select: 'name',
    });

  // Get user's orders
  const orders = await Order.find({ buyer: req.user._id })
    .populate('product', 'title category price');

  // Build user preference profile
  const likedCategories = user.likedProducts?.map(p => p.category) || [];
  const purchasedCategories = orders.map(o => o.product?.category).filter(Boolean);
  const viewedCategories = user.viewedProducts?.map(v => v.product?.category).filter(Boolean) || [];
  
  const allCategories = [...likedCategories, ...purchasedCategories, ...viewedCategories];
  const categoryFrequency = {};
  allCategories.forEach(cat => {
    categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
  });

  // Get all available products
  const allProducts = await Product.find({ isActive: true })
    .populate('artisan', 'name')
    .limit(100);

  // Prepare context for AI
  const userContext = {
    likedProducts: user.likedProducts?.map(p => ({ title: p.title, category: p.category })) || [],
    purchasedProducts: orders.map(o => ({ title: o.product?.title, category: o.product?.category })),
    viewedProducts: user.viewedProducts?.slice(-10).map(v => ({ title: v.product?.title, category: v.product?.category })) || [],
    favoriteArtists: user.favoriteArtists?.map(a => a.name) || [],
    preferredCategories: Object.entries(categoryFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat),
  };

  const productsContext = allProducts.map(p => ({
    id: p._id.toString(),
    title: p.title,
    category: p.category,
    price: p.price,
    artisan: p.artisan?.name,
    likes: p.likesCount,
  }));

  try {
    const model = google('gemini-1.5-flash');

    const prompt = `You are a product recommendation AI for a craft marketplace. Analyze the user's interaction history and recommend 6 products.

User Interaction History:
${JSON.stringify(userContext, null, 2)}

Available Products:
${JSON.stringify(productsContext, null, 2)}

Based on the user's likes, purchases, views, and favorite artists, recommend 6 product IDs that best match their preferences. Consider:
1. Categories they've shown interest in
2. Products from their favorite artists
3. Similar price ranges to what they've purchased
4. Trending products with high likes
5. Diversity in recommendations

Respond ONLY with a JSON array of 6 product IDs, nothing else. Format: ["id1", "id2", "id3", "id4", "id5", "id6"]`;

    const { text } = await generateText({
      model,
      prompt,
    });

    // Parse AI response
    let recommendedIds = [];
    try {
      recommendedIds = JSON.parse(text.trim());
    } catch (parseError) {
      // Fallback: extract IDs from response
      const matches = text.match(/"([a-f0-9]{24})"/g);
      if (matches) {
        recommendedIds = matches.map(m => m.replace(/"/g, '')).slice(0, 6);
      }
    }

    // Get recommended products
    const recommendedProducts = await Product.find({
      _id: { $in: recommendedIds },
      isActive: true,
    }).populate('artisan', 'name');

    // If less than 6, fill with popular products
    if (recommendedProducts.length < 6) {
      const additionalProducts = await Product.find({
        _id: { $nin: recommendedIds },
        isActive: true,
      })
        .sort({ likesCount: -1, createdAt: -1 })
        .limit(6 - recommendedProducts.length)
        .populate('artisan', 'name');
      
      recommendedProducts.push(...additionalProducts);
    }

    res.json({
      success: true,
      count: recommendedProducts.length,
      data: recommendedProducts,
    });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    
    // Fallback to simple recommendation
    const fallbackProducts = await Product.find({
      $or: [
        { category: { $in: Object.keys(categoryFrequency) } },
        { artisan: { $in: user.favoriteArtists || [] } },
      ],
      isActive: true,
    })
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(6)
      .populate('artisan', 'name');

    res.json({
      success: true,
      count: fallbackProducts.length,
      data: fallbackProducts,
      fallback: true,
    });
  }
});

// @desc    Track product view
// @route   POST /api/recommendations/track-view
// @access  Private
const trackProductView = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);
  
  if (!user.viewedProducts) {
    user.viewedProducts = [];
  }

  // Remove if already exists
  user.viewedProducts = user.viewedProducts.filter(
    v => v.product.toString() !== productId
  );

  // Add to beginning
  user.viewedProducts.unshift({
    product: productId,
    viewedAt: new Date(),
  });

  // Keep only last 50 views
  user.viewedProducts = user.viewedProducts.slice(0, 50);

  await user.save();

  res.json({
    success: true,
    message: 'Product view tracked',
  });
});

module.exports = {
  getRecommendations,
  trackProductView,
};
