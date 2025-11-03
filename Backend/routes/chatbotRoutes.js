const express = require('express');
const { chat, getProductRecommendations } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, chat);
router.post('/recommend', protect, getProductRecommendations);

module.exports = router;
