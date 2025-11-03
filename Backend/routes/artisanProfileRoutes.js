const express = require('express');
const {
  getProfile,
  createOrUpdateProfile,
  getProfileStatus,
} = require('../controllers/artisanProfileController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(artisanOnly);

router.route('/profile').get(getProfile).post(createOrUpdateProfile);
router.get('/profile/status', getProfileStatus);

module.exports = router;
