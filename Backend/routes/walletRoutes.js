const express = require('express');
const {
  getBalance,
  getTransactions,
  getEarnings,
} = require('../controllers/walletController');
const { protect, artisanOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/balance', getBalance);
router.get('/transactions', getTransactions);
router.get('/earnings', artisanOnly, getEarnings);

module.exports = router;
