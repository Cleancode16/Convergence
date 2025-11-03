const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const Workshop = require('../models/Workshop');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get AI-powered workshop recommendations
// @route   POST /api/workshops/recommendations
// @access  Private
const getWorkshopRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user's interaction data
  const user = await User.findById(userId).populate('favoriteProducts');
  
  // Get user's enrolled workshops
  const enrolledWorkshops = await Workshop.find({
    'enrolledUsers.user': userId,
  });

  // Get user's orders to understand their purchase patterns
  const orders = await Order.find({ user: userId }).populate('items.product');
  
  // Extract art forms from purchased products
  const purchasedArtForms = [];
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.product && item.product.category) {
        purchasedArtForms.push(item.product.category);
      }
    });
  });

  // Get all available workshops
  const allWorkshops = await Workshop.find({
    isActive: true,
    status: 'upcoming',
    availableSlots: { $gt: 0 },
  }).populate('artisan', 'name');

  // Prepare user preferences data
  const userPreferences = {
    favoriteArtForms: user.favoriteProducts?.map(p => p.category) || [],
    purchasedArtForms: [...new Set(purchasedArtForms)],
    enrolledWorkshopTypes: enrolledWorkshops.map(w => w.artForm),
    location: user.address?.city || 'Not specified',
  };

  const workshopsData = allWorkshops.map(w => ({
    id: w._id,
    name: w.name,
    artForm: w.artForm,
    date: w.date,
    location: w.location.city,
    artisan: w.artisan.name,
    availableSlots: w.availableSlots,
    price: w.price,
  }));

  try {
    const model = google('gemini-2.0-flash-exp');

    const prompt = `You are an AI recommendation system for handicraft workshops.

User Profile:
- Favorite Art Forms: ${userPreferences.favoriteArtForms.join(', ') || 'None'}
- Purchased Products (Art Forms): ${userPreferences.purchasedArtForms.join(', ') || 'None'}
- Previously Enrolled Workshops: ${userPreferences.enrolledWorkshopTypes.join(', ') || 'None'}
- Location: ${userPreferences.location}

Available Workshops:
${JSON.stringify(workshopsData, null, 2)}

Based on the user's purchase history, favorites, and previous workshop enrollments, recommend the TOP 5 most relevant workshops.

PRIORITIZE:
1. Art forms the user has purchased products in (highest priority)
2. User's favorite art forms
3. Similar to previously enrolled workshops
4. Variety in recommendations
5. Location proximity if available

Return ONLY a JSON array of workshop IDs in order of relevance (most relevant first):
["workshopId1", "workshopId2", "workshopId3", "workshopId4", "workshopId5"]

Return ONLY the JSON array, no markdown, no explanation.`;

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    });

    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recommendedIds = JSON.parse(cleanedText);

    // Get full workshop details for recommended IDs
    const recommendedWorkshops = await Workshop.find({
      _id: { $in: recommendedIds },
    })
      .populate('artisan', 'name email')
      .lean();

    // Sort according to AI recommendation order
    const sortedRecommendations = recommendedIds
      .map(id => recommendedWorkshops.find(w => w._id.toString() === id))
      .filter(Boolean);

    res.json({
      success: true,
      count: sortedRecommendations.length,
      data: sortedRecommendations,
    });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    
    // Fallback: recommend based on purchased art forms
    const fallbackRecommendations = allWorkshops
      .filter(w => userPreferences.purchasedArtForms.includes(w.artForm))
      .slice(0, 5);
    
    if (fallbackRecommendations.length === 0) {
      // If no matches, just return first 5
      const basicFallback = allWorkshops.slice(0, 5);
      return res.json({
        success: true,
        count: basicFallback.length,
        data: basicFallback,
        fallback: true,
      });
    }
    
    res.json({
      success: true,
      count: fallbackRecommendations.length,
      data: fallbackRecommendations,
      fallback: true,
    });
  }
});

module.exports = {
  getWorkshopRecommendations,
};
