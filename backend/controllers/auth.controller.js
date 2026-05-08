const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc  Register a new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email and password are required', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    const user = await User.create({ name, email, password, role: role || 'patient' });
    const token = generateToken(user._id, user.role);

    successResponse(res, { user, token }, 'Registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated', 403);
    }

    const token = generateToken(user._id, user.role);
    successResponse(res, { user, token }, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc  Get current user profile
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res, next) => {
  try {
    successResponse(res, req.user, 'Profile fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Update own profile
// @route PUT /api/auth/me
// @access Private
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, address, gender, dateOfBirth } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, gender, dateOfBirth },
      { new: true, runValidators: true }
    );
    successResponse(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateMe };
