const Notification = require('../models/Notification');

const createNotification = async ({ recipient, title, message, type = 'general', relatedAppointment = null }) => {
  try {
    await Notification.create({ recipient, title, message, type, relatedAppointment });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

module.exports = createNotification;
