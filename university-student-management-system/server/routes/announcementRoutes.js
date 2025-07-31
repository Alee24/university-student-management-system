const express = require('express');
const { body } = require('express-validator');
const announcementController = require('../controllers/announcementController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

// Get announcements (students and admins)
router.get('/', authenticate, announcementController.getAnnouncements);

// Post announcement (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  announcementController.createAnnouncement
);

// Delete announcement (admin only)
router.delete('/:id', authenticate, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router;