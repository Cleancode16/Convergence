const express = require('express');
const {
  getAllArtisans,
  getArtisanById,
  verifyArtisan,
  markAsFraud,
  rejectArtisan,
  getArtisanStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/artisans/stats', getArtisanStats);
router.get('/artisans', getAllArtisans);
router.get('/artisans/:id', getArtisanById);
router.put('/artisans/:id/verify', verifyArtisan);
router.put('/artisans/:id/fraud', markAsFraud);
router.put('/artisans/:id/reject', rejectArtisan);

module.exports = router;
