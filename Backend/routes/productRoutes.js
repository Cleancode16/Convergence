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

router.get('/', getProducts);
router.post('/', protect, artisanOnly, createProduct);
router.get('/favorites', protect, getFavoriteProducts); // Must come BEFORE /:id
router.get('/:id', getProduct);
router.put('/:id', protect, artisanOnly, updateProduct);
router.delete('/:id', protect, artisanOnly, deleteProduct);
router.put('/:id/like', protect, toggleLike);

module.exports = router;
