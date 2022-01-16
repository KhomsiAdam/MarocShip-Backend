// const db = require('../config/db');

// const managers = db.get('managers');
// managers.createIndex('email', { unique: true });

// module.exports = managers;
const mongoose = require('mongoose');

const Manager = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Manager', Manager);