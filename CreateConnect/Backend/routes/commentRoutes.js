const express = require('express');
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:productId', getComments);
router.post('/', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
