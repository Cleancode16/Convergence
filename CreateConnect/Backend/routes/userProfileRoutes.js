const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getProfileStatus,
} = require('../controllers/userProfileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/profile/status', protect, getProfileStatus);

module.exports = router;
