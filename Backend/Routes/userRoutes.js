const express = require('express');
const router = express.Router();
const { protect, admin } = require('../MiddleWares/authMiddleware');
const {
  getAllUsers,
  createUser,
  getUserCount,
  updateUserById,
  deleteUserById,
  updateLoggedInUserDetails,
  getLoggedInUser,
  upload
} = require('../Controllers/userController');

// Get all users (Admin-only route)
router.get('/', protect, admin, getAllUsers);

router.get('/user', protect, getLoggedInUser)

router.get('/count', protect, getUserCount )

// Create a new user
router.post('/users',protect, upload.single('profilePicture'), createUser);

// Update user by ID
router.put('/user/:id', protect, upload.single('profilePicture'), updateUserById);

router.put('/me', protect, upload.single('profilePicture'), updateLoggedInUserDetails);

// Delete user by ID
router.delete('/user/:id', protect, admin, deleteUserById);

module.exports = router;
