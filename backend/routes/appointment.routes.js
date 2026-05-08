const express = require('express');
const router = express.Router();
const {
  getAppointments, getAppointment, createAppointment,
  updateAppointment, cancelAppointment, deleteAppointment,
} = require('../controllers/appointment.controller');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', protect, getAppointments);
router.post('/', protect, requireRole('patient', 'admin'), createAppointment);
router.get('/:id', protect, getAppointment);
router.put('/:id', protect, requireRole('doctor', 'admin'), updateAppointment);
router.patch('/:id/cancel', protect, requireRole('patient', 'admin'), cancelAppointment);
router.delete('/:id', protect, requireRole('admin'), deleteAppointment);

module.exports = router;
