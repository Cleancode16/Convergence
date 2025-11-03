const express = require('express');
const {
  createWorkshop,
  updateWorkshopImages,
  getAllWorkshops,
  getWorkshop,
  enrollWorkshop,
  cancelEnrollment,
  getMyWorkshops,
  getEnrolledWorkshops,
  updateWorkshop,
  deleteWorkshop,
} = require('../controllers/workshopController');
const { getWorkshopRecommendations } = require('../controllers/workshopRecommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllWorkshops);
router.post('/', protect, createWorkshop);
router.post('/recommendations', protect, getWorkshopRecommendations);
router.get('/my/created', protect, getMyWorkshops);
router.get('/my/enrolled', protect, getEnrolledWorkshops);
router.get('/:id', getWorkshop);
router.put('/:id', protect, updateWorkshop);
router.delete('/:id', protect, deleteWorkshop);
router.put('/:id/images', protect, updateWorkshopImages);
router.post('/:id/enroll', protect, enrollWorkshop);
router.delete('/:id/enroll', protect, cancelEnrollment);

module.exports = router;
