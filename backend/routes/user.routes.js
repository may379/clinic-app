const express = require('express');
const router = express.Router();
const {
  getUsers, getUser, createUser, updateUser, toggleUserActive, deleteUser, getDoctors,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/doctors', protect, getDoctors);
router.get('/', protect, requireRole('admin'), getUsers);
router.post('/', protect, requireRole('admin'), createUser);
router.get('/:id', protect, requireRole('admin'), getUser);
router.put('/:id', protect, requireRole('admin'), updateUser);
router.patch('/:id/toggle-active', protect, requireRole('admin'), toggleUserActive);
router.delete('/:id', protect, requireRole('admin'), deleteUser);

module.exports = router;
