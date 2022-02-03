const express = require('express');

const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Controllers
const supervisorController = require('../controllers/supervisorController');
const deliveryController = require('../controllers/deliveryController');

// Errors
const LoginError = 'Unable to login.';

// Supervisor login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUserLogin(LoginError, (user) => !user),
  supervisorController.login,
);

// Refresh token
router.post(
  '/refresh',
  supervisorController.refresh,
);

// Get Deliveries
router.get(
  '/deliveries',
  auth.isAuth('Supervisor'),
  deliveryController.get,
);

// Delivery creation
router.post(
  '/delivery',
  auth.isAuth('Supervisor'),
  deliveryController.create,
);

// Activate Deliveries
router.patch(
  '/deliveries',
  auth.isAuth('Supervisor'),
  deliveryController.update,
);

// Change Delivery status to Delivered
router.patch(
  '/deliver/:id',
  auth.isAuth('Supervisor'),
  deliveryController.delivered,
);

module.exports = router;
