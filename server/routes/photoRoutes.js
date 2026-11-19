const express = require('express');
const photoController = require('../controllers/photoController');
const { requireUser } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { validate, validateObjectId, photoSchema } = require('../middleware/validation');

const router = express.Router();

router.get('/api/photos', photoController.getAll);
router.get('/api/photos/:id', validateObjectId, photoController.getOne);
// requireUser runs first so anonymous requests never reach the file upload
router.post('/api/photos', requireUser, upload.single('photo'), validate(photoSchema), photoController.create);
router.delete('/api/photos/:id', requireUser, validateObjectId, photoController.remove);

module.exports = router;
