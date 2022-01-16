// const db = require('../config/db');

// const admin = db.get('admin');
// admin.createIndex('email', { unique: true });

// module.exports = admin;
const mongoose = require('mongoose');

const Admin = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', Admin);