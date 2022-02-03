const express = require('express');

const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Controllers
const driverController = require('../controllers/driverController');
const deliveryController = require('../controllers/deliveryController');

// Errors
const LoginError = 'Unable to login.';

// Driver login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUserLogin(LoginError, (user) => !user),
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

// Get delivered deliveries
router.get(
  '/delivered',
  auth.isAuth('Driver'),
  deliveryController.getDelivered,
);

module.exports = router;
