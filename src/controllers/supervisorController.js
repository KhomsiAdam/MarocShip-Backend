const Supervisor = require('../models/Supervisor');
const userController = require('./userController');

const get = (req, res, next) => {
  userController.get(Supervisor, req, res, next);
}
const login = (req, res, next) => {
  userController.login('Supervisor', req, res, next);
}
const refresh = (req, res, next) => {
  userController.refresh(Supervisor, 'Supervisor', req, res, next);
}
const register = (req, res, next) => {
  userController.register(Supervisor, req, res, next);
}
const updateOne = (req, res, next) => {
  userController.updateOne(Supervisor, req, res, next);
}

module.exports = {
  get,
  login,
  refresh,
  register,
  updateOne
};