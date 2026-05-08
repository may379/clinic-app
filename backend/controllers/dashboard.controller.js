const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { successResponse } = require('../utils/apiResponse');

// @desc  Get dashboard stats based on role
// @route GET /api/dashboard
// @access Private
const getDashboardStats = async (req, res, next) => {
  try {
    const { role, _id } = req.user;

    if (role === 'admin') {
      const [totalPatients, totalDoctors, totalAppointments, pending, done, cancelled, recentAppointments] =
        await Promise.all([
          User.countDocuments({ role: 'patient' }),
          User.countDocuments({ role: 'doctor' }),
          Appointment.countDocuments(),
          Appointment.countDocuments({ status: 'pending' }),
          Appointment.countDocuments({ status: 'done' }),
          Appointment.countDocuments({ status: 'cancelled' }),
          Appointment.find().sort({ createdAt: -1 }).limit(5)
            .populate('patient', 'name')
            .populate('doctor', 'name specialization'),
        ]);

      return successResponse(res, {
        totalPatients,
        totalDoctors,
        totalAppointments,
        pending,
        done,
        cancelled,
        recentAppointments,
      });
    }

    if (role === 'doctor') {
      const [totalPatients, pending, done, cancelled, recentAppointments, unreadNotifications] =
        await Promise.all([
          Appointment.distinct('patient', { doctor: _id }).then((p) => p.length),
          Appointment.countDocuments({ doctor: _id, status: 'pending' }),
          Appointment.countDocuments({ doctor: _id, status: 'done' }),
          Appointment.countDocuments({ doctor: _id, status: 'cancelled' }),
          Appointment.find({ doctor: _id }).sort({ date: 1 }).limit(5)
            .populate('patient', 'name email phone'),
          Notification.countDocuments({ recipient: _id, isRead: false }),
        ]);

      return successResponse(res, {
        totalPatients,
        pending,
        done,
        cancelled,
        recentAppointments,
        unreadNotifications,
      });
    }

    if (role === 'patient') {
      const [totalAppointments, pending, done, cancelled, recentAppointments, unreadNotifications] =
        await Promise.all([
          Appointment.countDocuments({ patient: _id }),
          Appointment.countDocuments({ patient: _id, status: 'pending' }),
          Appointment.countDocuments({ patient: _id, status: 'done' }),
          Appointment.countDocuments({ patient: _id, status: 'cancelled' }),
          Appointment.find({ patient: _id }).sort({ date: -1 }).limit(5)
            .populate('doctor', 'name specialization'),
          Notification.countDocuments({ recipient: _id, isRead: false }),
        ]);

      return successResponse(res, {
        totalAppointments,
        pending,
        done,
        cancelled,
        recentAppointments,
        unreadNotifications,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
