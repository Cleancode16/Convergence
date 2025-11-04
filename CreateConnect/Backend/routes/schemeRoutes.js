const express = require('express');
const {
  getSchemeRecommendations,
  getSchemeDetails,
} = require('../controllers/schemeController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(artisanOnly);

router.get('/recommendations', getSchemeRecommendations);
router.post('/details', getSchemeDetails);

module.exports = router;
