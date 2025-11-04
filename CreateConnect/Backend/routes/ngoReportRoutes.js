const express = require('express');
const {
  generateNGOReport,
  getReportSummary,
} = require('../controllers/ngoReportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/generate', generateNGOReport);
router.get('/summary', getReportSummary);

module.exports = router;
