const express = require('express');
const router = express.Router();
const { registerUser, authUser, getAllUsers, forgotPassword1, getResetToken, resetPassword1, changePassword  } = require('../Controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/allUsers', getAllUsers)
router.post("/forgot-password", forgotPassword1)

router.get("/password-reset/:id/:token",getResetToken)

router.post("/password-reset/:id/:token",resetPassword1)

router.put('/change-password',changePassword);

module.exports = router;