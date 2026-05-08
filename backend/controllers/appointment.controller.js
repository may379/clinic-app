const Appointment = require('../models/Appointment');
const createNotification = require('../utils/createNotification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc  Get appointments based on role
// @route GET /api/appointments
// @access Private
const getAppointments = async (req, res, next) => {
  try {
    const { role, _id } = req.user;
    const { status, search } = req.query;

    let filter = {};
    if (role === 'patient') filter.patient = _id;
    if (role === 'doctor') filter.doctor = _id;
    if (status) filter.status = status;

    let query = Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });

    const appointments = await query;
    successResponse(res, appointments, 'Appointments fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Get single appointment
// @route GET /api/appointments/:id
// @access Private
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone dateOfBirth gender')
      .populate('doctor', 'name specialization email');

    if (!appointment) return errorResponse(res, 'Appointment not found', 404);

    const { role, _id } = req.user;
    if (
      role === 'patient' && appointment.patient._id.toString() !== _id.toString() ||
      role === 'doctor' && appointment.doctor._id.toString() !== _id.toString()
    ) {
      return errorResponse(res, 'Access denied', 403);
    }

    successResponse(res, appointment, 'Appointment fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Create appointment
// @route POST /api/appointments
// @access Patient, Admin
const createAppointment = async (req, res, next) => {
  try {
    const { doctor, date, time, reason, notes } = req.body;

    if (!doctor || !date || !time || !reason) {
      return errorResponse(res, 'Doctor, date, time and reason are required', 400);
    }

    const patientId = req.user.role === 'admin' ? req.body.patient : req.user._id;

    const appointment = await Appointment.create({
      patient: patientId,
      doctor,
      date,
      time,
      reason,
      notes,
    });

    await appointment.populate('patient', 'name');
    await appointment.populate('doctor', 'name');

    await createNotification({
      recipient: doctor,
      title: 'New Appointment',
      message: `${appointment.patient.name} booked an appointment with you on ${new Date(date).toDateString()} at ${time}.`,
      type: 'appointment_created',
      relatedAppointment: appointment._id,
    });

    await createNotification({
      recipient: patientId,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${appointment.doctor.name} on ${new Date(date).toDateString()} at ${time} has been booked.`,
      type: 'appointment_created',
      relatedAppointment: appointment._id,
    });

    successResponse(res, appointment, 'Appointment created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Update appointment (status, notes)
// @route PUT /api/appointments/:id
// @access Doctor, Admin
const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes, date, time, reason } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name')
      .populate('doctor', 'name');

    if (!appointment) return errorResponse(res, 'Appointment not found', 404);

    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Access denied', 403);
    }

    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;

    await appointment.save();

    if (status) {
      await createNotification({
        recipient: appointment.patient._id,
        title: 'Appointment Updated',
        message: `Your appointment on ${new Date(appointment.date).toDateString()} has been marked as ${status}.`,
        type: 'appointment_updated',
        relatedAppointment: appointment._id,
      });
    }

    successResponse(res, appointment, 'Appointment updated');
  } catch (error) {
    next(error);
  }
};

// @desc  Cancel appointment
// @route PATCH /api/appointments/:id/cancel
// @access Patient, Admin
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name')
      .populate('doctor', 'name');

    if (!appointment) return errorResponse(res, 'Appointment not found', 404);

    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Access denied', 403);
    }

    appointment.status = 'cancelled';
    await appointment.save();

    await createNotification({
      recipient: appointment.doctor._id,
      title: 'Appointment Cancelled',
      message: `${appointment.patient.name} cancelled their appointment on ${new Date(appointment.date).toDateString()}.`,
      type: 'appointment_cancelled',
      relatedAppointment: appointment._id,
    });

    successResponse(res, appointment, 'Appointment cancelled');
  } catch (error) {
    next(error);
  }
};

// @desc  Delete appointment
// @route DELETE /api/appointments/:id
// @access Admin
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return errorResponse(res, 'Appointment not found', 404);
    successResponse(res, null, 'Appointment deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments, getAppointment, createAppointment,
  updateAppointment, cancelAppointment, deleteAppointment,
};
