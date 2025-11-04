const express = require('express');
const {
  getProfile,
  createOrUpdateProfile,
  getProfileStatus,
} = require('../controllers/artisanProfileController');
const {
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectedNgos,
} = require('../controllers/artisanConnectionController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(artisanOnly);

router.route('/profile').get(getProfile).post(createOrUpdateProfile);
router.get('/profile/status', getProfileStatus);
router.get('/connection-requests', getConnectionRequests);
router.put('/connection-requests/:id/accept', acceptConnectionRequest);
router.put('/connection-requests/:id/reject', rejectConnectionRequest);
router.get('/connections', getConnectedNgos);

module.exports = router;
