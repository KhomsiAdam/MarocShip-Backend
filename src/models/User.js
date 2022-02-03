const mongoose = require('mongoose');

const User = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', User);
