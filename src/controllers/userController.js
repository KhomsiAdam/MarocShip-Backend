const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const auth = require('../middlewares/auth');
const Truck = require('../models/Truck');

const { userSchema } = require('../helpers/validation');
const { setRefreshSecret } = require('../helpers/secret');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const Supervisor = require('../models/Supervisor');

// Get all users (without passwords), if it's a driver get his truck
const get = async (Model, req, res, next) => {
  if (Model.modelName !== 'Driver') {
    try {
      const result = await Model.find().select('-password');
      res.json(result);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const result = await Model.find().select('-password').populate('truck');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};

// Register a user
const register = async (Model, req, res, next) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 12);
    let newUser;
    if (Model.modelName !== 'Driver') {
      newUser = new Model({
        email: req.body.email,
        password: hashed,
      });
    } else {
      const trucks = await Truck.find();
      const randomTruck = trucks[Math.floor(Math.random() * trucks.length)];
      newUser = new Model({
        email: req.body.email,
        password: hashed,
        truck: randomTruck._id,
      });
    }
    await newUser.save();
    const registeredUser = new User({
      email: req.body.email,
      role: Model.modelName,
    });
    await registeredUser.save();
    res.json({ message: 'User was created successfully.' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const result = await bcrypt.compare(
      req.body.password,
      req.user.password,
    );
    if (result) {
      // Set refresh token in cookie
      auth.sendRefreshToken(res, auth.generateRefreshToken(req.user, req.role));
      // Send access token
      res.json({
        token: auth.generateAccessToken(req.user, req.role),
        role: [req.role],
      });
    } else {
      res.status(422);
      throw new Error('Unable to login.');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    next(error);
  }
};
// const login = async (role, req, res, next) => {
//   try {
//     const result = await bcrypt.compare(
//       req.body.password,
//       req.user.password,
//     );
//     if (result) {
//       // Set refresh token in cookie
//       auth.sendRefreshToken(res, auth.generateRefreshToken(req.user, role));
//       // Send access token
//       res.json({
//         token: auth.generateAccessToken(req.user, role),
//       });
//     } else {
//       res.status(422);
//       throw new Error('Unable to login.');
//     }
//   } catch (error) {
//     res.status(res.statusCode === 200 ? 500 : res.statusCode);
//     next(error);
//   }
// };

// Refresh access token
const refresh = async (req, res) => {
  // Get refresh token from cookie
  const token = req.cookies.rtkn;
  if (!token) {
    return res.json({ message: false });
  }
  console.log(token);
  const { role } = jwt.decode(token);
  // Validate refresh token
  let payload = null;
  try {
    const secret = setRefreshSecret(role);
    payload = jwt.verify(token, secret);
    console.log(payload);
  } catch (err) {
    __log.error(err);
    res.json({ message: false });
  }
  // Get user
  let user;
  switch (role) {
    case 'Admin':
      user = await Admin.findOne({ _id: payload._id });
      break;
    case 'Manager':
      user = await Manager.findOne({ _id: payload._id });
      break;
    case 'Supervisor':
      user = await Supervisor.findOne({ _id: payload._id });
      break;
    case 'Driver':
      user = await Driver.findOne({ _id: payload._id });
      break;
    default:
      break;
  }
  console.log(user);
  if (!user) {
    res.json({ message: false });
  }
  // Generate new refresh token
  auth.sendRefreshToken(res, auth.generateRefreshToken(user, role));

  // Generate new access token
  const generatedToken = auth.generateAccessToken(user, role);
  console.log(generatedToken);
  res.json({ token: generatedToken, role: [role] });
};
// const refresh = async (Model, role, req, res) => {
//   // Get refresh token from cookie
//   const token = req.cookies.rtkn;
//   console.log(token);
//   console.log(jwt.decode(token));
//   if (!token) {
//     return res.json({ message: false });
//   }
//   // Validate refresh token
//   let payload = null;
//   try {
//     const secret = setRefreshSecret(role);
//     console.log(secret);
//     payload = jwt.verify(token, secret);
//     console.log(payload);
//   } catch (err) {
//     __log.error(err);
//     res.json({ message: false });
//   }
//   // Get user
//   const user = await Model.findOne({ _id: payload._id });
//   // console.log(Model);
//   if (!user) {
//     res.json({ message: false });
//   }
//   // Generate new refresh token
//   auth.sendRefreshToken(res, auth.generateRefreshToken(user, role));

//   // Generate new access token
//   const generatedToken = auth.generateAccessToken(user, role);
//   console.log(generatedToken);
//   res.json({ token: generatedToken, role: [role] });
// };

// Logout user, reset refresh token
const logout = async (res) => {
  // console.log(res);
  // auth.sendRefreshToken(res, '');
  res.clearCookie('rtkn');
};

// Update user
const updateOne = async (Model, req, res, next) => {
  const { id: _id } = req.params;
  try {
    const result = userSchema.validate(req.body);
    if (!result.error) {
      const query = { _id };
      const user = await Model.findOne(query);
      if (user) {
        const updatedUser = req.body;
        if (updatedUser.password) {
          updatedUser.password = await bcrypt.hash(updatedUser.password, 12);
        }
        const response = await Model.findOneAndUpdate(query, {
          $set: updatedUser,
        }, { new: true }).select('-password');
        res.json(response);
      } else {
        next();
      }
    } else {
      res.status(422);
      __log.error(result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  login,
  refresh,
  register,
  logout,
  updateOne,
};
