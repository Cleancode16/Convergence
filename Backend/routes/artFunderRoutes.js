import express from 'express';
import {
  getArtFunders,
  refreshArtFunders,
  searchArtFunders,
} from '../controllers/artFunderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getArtFunders);
router.get('/search', searchArtFunders);
router.post('/refresh', protect, adminOnly, refreshArtFunders);

export default router;
