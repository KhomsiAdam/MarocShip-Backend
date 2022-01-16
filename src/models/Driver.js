// const db = require('../config/db');

// const drivers = db.get('drivers');
// drivers.createIndex('email', { unique: true });

// module.exports = drivers;
const mongoose = require('mongoose');

const Driver = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', Driver);