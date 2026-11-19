const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const { uploadDir } = require('../middleware/upload');

const ownerFields = 'firstName lastName';

// GET /api/photos
exports.getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find().sort({ dateTime: -1 }).populate('userId', ownerFields);
    res.json(photos);
  } catch (err) {
    next(err);
  }
};

// GET /api/photos/:id
exports.getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', ownerFields);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    next(err);
  }
};

// POST /api/photos  (multipart/form-data: photo, title, description)
exports.create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Validation failed', details: ['A photo file is required'] });
    }

    const photo = await Photo.create({
      userId: req.user._id,
      fileName: req.file.filename,
      title: req.body.title,
      description: req.body.description,
    });

    await photo.populate('userId', ownerFields);
    res.status(201).json(photo);
  } catch (err) {
    // Do not leave an orphan file if saving the metadata failed
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
};

// DELETE /api/photos/:id  (owner only)
exports.remove = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // Ownership is checked on the server, never trusted from the client
    if (photo.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own photos' });
    }

    await fs.promises.unlink(path.join(uploadDir, photo.fileName)).catch(() => {});
    await Comment.deleteMany({ photoId: photo._id });
    await photo.deleteOne();

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
