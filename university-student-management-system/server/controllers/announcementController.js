const { validationResult } = require('express-validator');
const announcementModel = require('../models/announcementModel');

async function getAnnouncements(req, res, next) {
  try {
    const announcements = await announcementModel.getAnnouncements();
    res.json({ announcements });
  } catch (err) {
    next(err);
  }
}

async function createAnnouncement(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, message } = req.body;
    const announcement = await announcementModel.createAnnouncement({
      title,
      message,
      posted_by: req.user.id,
    });
    res.status(201).json({ announcement });
  } catch (err) {
    next(err);
  }
}

async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params;
    await announcementModel.deleteAnnouncement(id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};