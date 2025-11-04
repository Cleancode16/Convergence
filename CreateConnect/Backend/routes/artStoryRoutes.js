const express = require('express');
const {
  createArtStory,
  updateArtStory,
  getAllStories,
  getStory,
  toggleLike,
  deleteStory,
} = require('../controllers/artStoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllStories);
router.post('/', protect, adminOnly, createArtStory);
router.get('/:id', getStory);
router.put('/:id', protect, adminOnly, updateArtStory);
router.put('/:id/like', protect, toggleLike);
router.delete('/:id', protect, adminOnly, deleteStory);

module.exports = router;
