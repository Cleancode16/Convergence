const express = require('express');
const {
  createOrUpdatePost,
  getAllPosts,
  getPost,
  getMyPost,
  deletePost,
  toggleLike,
  toggleFavorite,
  getFavoriteArtists,
} = require('../controllers/artistPostController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/my-post', protect, artisanOnly, getMyPost);
router.get('/favorites/my-favorites', protect, getFavoriteArtists);
router.post('/', protect, artisanOnly, createOrUpdatePost);
router.get('/:id', getPost);
router.delete('/:id', protect, artisanOnly, deletePost);
router.put('/:id/like', protect, toggleLike);
router.put('/:artistId/favorite', protect, toggleFavorite);

module.exports = router;
