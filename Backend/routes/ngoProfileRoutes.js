const express = require('express');
const {
  getProfile,
  createOrUpdateProfile,
  getProfileStatus,
} = require('../controllers/ngoProfileController');
const { protect, ngoOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(ngoOnly);

router.route('/profile').get(getProfile).post(createOrUpdateProfile);
router.get('/profile/status', getProfileStatus);

module.exports = router;
