const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Only these image types are accepted; the extension comes from the MIME type
const extensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString('hex') + extensions[file.mimetype]);
  },
});

const fileFilter = (req, file, cb) => {
  if (extensions[file.mimetype]) return cb(null, true);
  const err = new Error('Only JPG, PNG, GIF or WEBP images are allowed');
  err.status = 400;
  cb(err);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { upload, uploadDir };
