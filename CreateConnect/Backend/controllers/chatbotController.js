const asyncHandler = require('express-async-handler');
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Chat with AI assistant
// @route   POST /api/chatbot
// @access  Private
const chat = asyncHandler(async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Please provide a message');
  }

  try {
    console.log('Processing chat message:', message);

    // Get all active products for context
    const products = await Product.find({ isActive: true })
      .populate('artisan', 'name')
      .limit(50)
      .lean();

    console.log(`Found ${products.length} active products`);

    // Prepare product data - simplified
    const productData = products.slice(0, 10).map(p => ({
      name: p.name,
      category: p.category,
      price: p.price,
    }));

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Only last 5 messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a helpful AI assistant for CraftConnect, an Indian handicrafts e-commerce platform.

Your role:
1. Recommend products based on user needs
2. Answer product questions
3. Share cultural information about Indian art forms
4. Explain platform features

Sample Products:
${JSON.stringify(productData, null, 2)}

Guidelines:
- Be warm and friendly
- Use rupee symbol (₹) for prices
- Keep responses concise (2-3 sentences)
- Encourage exploration

Previous conversation:
${conversationContext}

User question: ${message}

Respond:`;

    // Check if Google API key exists
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('Google API key not found');
      return res.json({
        success: true,
        message: "I can help you find products! Try asking about pottery, paintings, or other handicrafts. You can also specify a budget like 'products under ₹500'.",
        timestamp: new Date(),
      });
    }

    const model = google('gemini-2.0-flash-exp');

    const { text } = await generateText({
      model,
      prompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 300,
    });

    console.log('Generated response successfully');

    res.json({
      success: true,
      message: text,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
    
    // Fallback response
    res.json({
      success: true,
      message: "I'm here to help you discover beautiful Indian handicrafts! You can ask me about products, pricing, or our artisan community. Try asking 'Show me pottery products' or 'Products under ₹500'.",
      timestamp: new Date(),
    });
  }
});

// @desc    Get product recommendations
// @route   POST /api/chatbot/recommend
// @access  Private
const getProductRecommendations = asyncHandler(async (req, res) => {
  const { category, budget, preferences } = req.body;

  try {
    console.log('Getting recommendations:', { category, budget, preferences });

    let query = { isActive: true };

    if (category) {
      query.category = new RegExp(category, 'i'); // Case-insensitive search
    }

    if (budget) {
      query.price = { $lte: budget };
    }

    const products = await Product.find(query)
      .populate('artisan', 'name')
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(3)
      .lean();

    console.log(`Found ${products.length} products`);

    if (products.length === 0) {
      return res.json({
        success: true,
        products: [],
        recommendations: 'No products found matching your criteria. Try adjusting your budget or browsing all products!',
      });
    }

    res.json({
      success: true,
      products,
      recommendations: `Found ${products.length} great ${category || 'handicraft'} products for you!`,
    });
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      products: [],
    });
  }
});

module.exports = {
  chat,
  getProductRecommendations,
};
