const express = require('express');
const {
  getRecommendations,
  trackProductView,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getRecommendations);
router.post('/track-view', trackProductView);

module.exports = router;
