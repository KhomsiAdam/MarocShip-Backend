const mongoose = require('mongoose');

const Vehicle = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', Vehicle);
