const express = require('express');

const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Models
const Manager = require('../models/Manager');
const Supervisor = require('../models/Supervisor');
const Driver = require('../models/Driver');

// Controllers
const managerController = require('../controllers/managerController');
const supervisorController = require('../controllers/supervisorController');
const driverController = require('../controllers/driverController');

// Errors
const LoginError = 'Unable to login.';
const registerError = 'User already exists with this email.';

// Manager login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUser(Manager, LoginError, (user) => !user),
  managerController.login,
);

// Refresh token
router.post(
  '/refresh',
  managerController.refresh,
);

// Get Supervisors
router.get(
  '/supervisors',
  auth.isAuth('Manager'),
  supervisorController.get,
);

// Get Drivers
router.get(
  '/drivers',
  auth.isAuth('Manager'),
  driverController.get,
);

// Supervisor register
router.post(
  '/supervisor',
  auth.isAuth('Manager'),
  auth.validateUser(),
  auth.findUser(Supervisor, registerError, (user) => user, 409),
  supervisorController.register,
);

// Driver register
router.post(
  '/driver',
  auth.isAuth('Manager'),
  auth.validateUser(),
  auth.findUser(Driver, registerError, (user) => user, 409),
  driverController.register,
);

// Update Supervisor
router.patch(
  '/supervisor/:id',
  auth.isAuth('Manager'),
  supervisorController.updateOne,
);

// Update Driver
router.patch(
  '/driver/:id',
  auth.isAuth('Manager'),
  driverController.updateOne,
);

// Apply bonus to drivers
router.post(
  '/bonus',
  auth.isAuth('Manager'),
  driverController.bonus,
);

module.exports = router;
