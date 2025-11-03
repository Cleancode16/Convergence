const express = require('express');
const {
  createDonation,
  getNGODonations,
  getMyDonations,
  getAllNGOs,
  getNGODetails,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/ngos', getAllNGOs);
router.get('/ngos/:id', getNGODetails);
router.post('/', protect, createDonation);
router.get('/ngo', protect, getNGODonations);
router.get('/my', protect, getMyDonations);

module.exports = router;
