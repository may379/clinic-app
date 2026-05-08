const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc  Get all users (with optional role filter)
// @route GET /api/users
// @access Admin
const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const users = await User.find(filter).sort({ createdAt: -1 });
    successResponse(res, users, 'Users fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Get single user
// @route GET /api/users/:id
// @access Admin
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    successResponse(res, user, 'User fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Create user (admin creates doctor/patient accounts)
// @route POST /api/users
// @access Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization, gender, dateOfBirth, address } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email and password are required', 400);
    }

    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, 'Email already registered', 400);

    const user = await User.create({
      name, email, password, role, phone, specialization, gender, dateOfBirth, address,
    });

    successResponse(res, user, 'User created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Update user
// @route PUT /api/users/:id
// @access Admin
const updateUser = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true });
    if (!user) return errorResponse(res, 'User not found', 404);
    successResponse(res, user, 'User updated');
  } catch (error) {
    next(error);
  }
};

// @desc  Deactivate / reactivate user
// @route PATCH /api/users/:id/toggle-active
// @access Admin
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    user.isActive = !user.isActive;
    await user.save();
    successResponse(res, user, `User ${user.isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete user
// @route DELETE /api/users/:id
// @access Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    successResponse(res, null, 'User deleted');
  } catch (error) {
    next(error);
  }
};

// @desc  Get all doctors (for patient booking dropdown)
// @route GET /api/users/doctors
// @access Private
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true }).select('name specialization');
    successResponse(res, doctors, 'Doctors fetched');
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, toggleUserActive, deleteUser, getDoctors };
