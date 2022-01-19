const express = require('express');

const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Models
const Driver = require('../models/Driver');

// Controllers
const driverController = require('../controllers/driverController');
const deliveryController = require('../controllers/deliveryController');

// Errors
const LoginError = 'Unable to login.';

// Driver login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUser(Driver, LoginError, (user) => !user),
  driverController.login,
);

// Refresh token
router.post(
  '/refresh',
  driverController.refresh,
);

// Get available Deliveries
router.get(
  '/deliveries',
  auth.isAuth('Driver'),
  deliveryController.getBy,
);

// Claim Delivery
router.patch(
  '/delivery/:id',
  auth.isAuth('Driver'),
  deliveryController.claim,
);

// Get claimed deliveries
router.get(
  '/claimed',
  auth.isAuth('Driver'),
  deliveryController.getClaimed,
);

module.exports = router;
