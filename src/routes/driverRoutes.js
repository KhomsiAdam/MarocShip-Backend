const express = require('express');

const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Models
const Driver = require('../models/Driver');

// Controllers
const driverController = require('../controllers/driverController');

// Errors
const LoginError = 'Unable to login.';

// Refresh token
router.post('/refresh', driverController.refresh);

// Driver login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUser(Driver, LoginError, (user) => !user),
  driverController.login,
);

module.exports = router;
