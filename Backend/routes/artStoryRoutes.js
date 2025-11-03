const express = require('express');
const {
  generateArtStory,
  getAllStories,
  getStory,
  toggleLike,
  deleteStory,
} = require('../controllers/artStoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllStories);
router.post('/generate', protect, adminOnly, generateArtStory);
router.get('/:id', getStory);
router.put('/:id/like', protect, toggleLike);
router.delete('/:id', protect, adminOnly, deleteStory);

module.exports = router;
