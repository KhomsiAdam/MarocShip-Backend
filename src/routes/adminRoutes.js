const express = require('express');

const router = express.Router();

// Middlewares
const auth = require('../middlewares/auth');

// Models
const Admin = require('../models/Admin');
const Manager = require('../models/Manager');

// Controllers
const adminController = require('../controllers/adminController');
const managerController = require('../controllers/managerController');

// Errors
const LoginError = 'Unable to login.';
const registerError = 'User already exists with this email.';

// Refresh token
router.post('/refresh', adminController.refresh);

// Get Managers
router.get('/managers', auth.isAuth('Admin'), managerController.get);

// Admin login
router.post(
  '/login',
  auth.validateUser(LoginError),
  auth.findUser(Admin, LoginError, (user) => !user),
  adminController.login,
);

// Admin register
router.post(
  '/register',
  auth.validateUser(),
  auth.findUser(Admin, registerError, (user) => user, 409),
  adminController.register,
);

// Manager register
router.post(
  '/manager',
  auth.isAuth('Admin'),
  auth.validateUser(),
  auth.findUser(Manager, registerError, (user) => user, 409),
  managerController.register,
);

// Update Manager
router.patch('/manager/:id', auth.isAuth('Admin'), managerController.updateOne);

module.exports = router;
