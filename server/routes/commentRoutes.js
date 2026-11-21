const express = require('express');
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validate, validateObjectId, commentSchema } = require('../middleware/validation');

const router = express.Router();

router.get('/api/photos/:id/comments', validateObjectId, commentController.getByPhoto);
router.post(
  '/api/photos/:id/comments',
  protect,
  validateObjectId,
  validate(commentSchema),
  commentController.create
);

module.exports = router;
