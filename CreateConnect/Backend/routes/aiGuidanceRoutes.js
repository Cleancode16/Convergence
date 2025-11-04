const express = require('express');
const { getSponsorApproach } = require('../controllers/aiGuidanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/sponsor-approach', protect, getSponsorApproach);

module.exports = router;
