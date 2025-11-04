const express = require('express');
const {
  getSalesAnalytics,
  getProductAnalytics,
} = require('../controllers/analyticsController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(artisanOnly);

router.get('/sales', getSalesAnalytics);
router.get('/product/:id', getProductAnalytics);

module.exports = router;
