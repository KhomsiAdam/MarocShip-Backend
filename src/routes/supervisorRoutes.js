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
