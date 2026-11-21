const express = require('express');
const photoController = require('../controllers/photoController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { validate, validateObjectId, photoSchema } = require('../middleware/validation');

const router = express.Router();

router.get('/api/photos', photoController.getAll);
router.get('/api/photos/:id', validateObjectId, photoController.getOne);
// protect checks the token first so anonymous requests never reach the file upload
router.post('/api/photos', protect, upload.single('photo'), validate(photoSchema), photoController.create);
router.delete('/api/photos/:id', protect, validateObjectId, photoController.remove);

module.exports = router;
