const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleLike,
  getFavoriteProducts,
} = require('../controllers/productController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// IMPORTANT: /favorites MUST come BEFORE /:id
router.get('/favorites', protect, getFavoriteProducts);
router.get('/', getProducts);
router.post('/', protect, artisanOnly, createProduct);
router.get('/:id', getProduct);
router.put('/:id', protect, artisanOnly, updateProduct);
router.delete('/:id', protect, artisanOnly, deleteProduct);
router.put('/:id/like', protect, toggleLike);

module.exports = router;
