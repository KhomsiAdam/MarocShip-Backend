const Manager = require('../models/Manager');
const userController = require('./userController');

const get = (req, res, next) => {
  userController.get(Manager, req, res, next);
}
const login = (req, res, next) => {
  userController.login('Manager', req, res, next);
}
const refresh = (req, res, next) => {
  userController.refresh(Manager, 'Manager', req, res, next);
}
const register = (req, res, next) => {
  userController.register(Manager, req, res, next);
}
const updateOne = (req, res, next) => {
  userController.updateOne(Manager, req, res, next);
}

module.exports = {
  get,
  login,
  refresh,
  register,
  updateOne
};