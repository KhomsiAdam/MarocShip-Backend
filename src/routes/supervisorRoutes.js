const express = require('express');

const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Models
const Supervisor = require('../models/Supervisor');

// Controllers
const supervisorController = require('../controllers/supervisorController');
const deliveryController = require('../controllers/deliveryController');

// Errors
const LoginError = 'Unable to login.';

// Refresh token
router.post('/refresh', supervisorController.refresh);

// Supervisor login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUser(Supervisor, LoginError, (user) => !user),
  supervisorController.login,
);

// Delivery creation
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

module.exports = router;
