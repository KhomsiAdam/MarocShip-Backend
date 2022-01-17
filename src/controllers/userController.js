const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const auth = require('../middlewares/auth');

// User schema for validation
const userSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ma'] } })
    .trim()
    .required(),

  password: Joi.string()
    .trim()
    .min(10)
    .required(),
});

// Get all users (without passwords)
const get = async (Model, req, res, next) => {
  try {
    const result = await Model.find().select('-password');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Register a user
const register = async (Model, req, res, next) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 12);
    const newUser = new Model({
      email: req.body.email,
      password: hashed,
    });
    await newUser.save();
    res.json({ message: 'User was created successfully.' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// User login
const login = async (role, req, res, next) => {
  try {
    const result = await bcrypt.compare(
      req.body.password,
      req.user.password,
    );
    if (result) {
      // Set refresh token in cookie
      auth.sendRefreshToken(res, auth.generateRefreshToken(req.user, role));
      // Send access token
      res.json({
        token: auth.generateAccessToken(req.user, role),
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

// Refresh access token
const refresh = async (Model, role, req, res) => {
  // Get refresh token from cookie
  const token = req.cookies.rtkn;
  if (!token) {
    return res.json({ message: false });
  }
  // Validate refresh token
  let payload = null;
  try {
    payload = jwt.verify(token, auth.setRefreshSecret(role));
  } catch (err) {
    __log.error(err);
    return res.json({ message: false });
  }
  // Get user
  const user = await Model.findOne({ _id: payload._id });
  if (!user) {
    return res.json({ message: false });
  }
  // Generate new refresh token
  auth.sendRefreshToken(res, auth.generateRefreshToken(user, role));

  // Generate new access token
  return res.json({ token: auth.generateAccessToken(user, role) });
};

// Logout user
const logout = async (res) => {
  auth.sendRefreshToken(res, '');
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
