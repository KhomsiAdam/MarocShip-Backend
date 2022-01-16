const express = require('express');
const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Models
const Supervisor = require('../models/Supervisor');

// Controllers
const supervisorController = require('../controllers/supervisorController');

// Errors
const LoginError = 'Unable to login.';
const registerError = 'User already exists with this email.';

// Refresh token
router.post('/refresh', supervisorController.refresh);

// Manager login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUser(Supervisor, LoginError, (user) => !user),
  supervisorController.login,
);

module.exports = router;