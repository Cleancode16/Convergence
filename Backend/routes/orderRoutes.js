const express = require('express');
const {
  createOrder,
  getMyOrders,
  getArtisanOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/artisan-orders', artisanOnly, getArtisanOrders);
router.put('/:id', artisanOnly, updateOrderStatus);

module.exports = router;
