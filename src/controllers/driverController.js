const Driver = require('../models/Driver');
const userController = require('./userController');

const get = (req, res, next) => {
  userController.get(Driver, req, res, next);
};
const login = (req, res, next) => {
  userController.login('Driver', req, res, next);
};
const refresh = (req, res, next) => {
  userController.refresh(Driver, 'Driver', req, res, next);
};
const register = (req, res, next) => {
  userController.register(Driver, req, res, next);
};
const updateOne = (req, res, next) => {
  userController.updateOne(Driver, req, res, next);
};

module.exports = {
  get,
  login,
  refresh,
  register,
  updateOne,
};
