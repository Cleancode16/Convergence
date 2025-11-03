const express = require('express');
const {
  getProfile,
  createOrUpdateProfile,
  getProfileStatus,
  getMatchingArtisans,
  getArtisanDetails,
} = require('../controllers/ngoProfileController');
const {
  sendConnectionRequest,
  getNgoConnections,
  cancelConnectionRequest,
} = require('../controllers/connectionController');
const { protect, ngoOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(ngoOnly);

router.route('/profile').get(getProfile).post(createOrUpdateProfile);
router.get('/profile/status', getProfileStatus);
router.get('/artisans', getMatchingArtisans);
router.get('/artisans/:id', getArtisanDetails);
router.route('/connections').get(getNgoConnections).post(sendConnectionRequest);
router.delete('/connections/:id', cancelConnectionRequest);

module.exports = router;
