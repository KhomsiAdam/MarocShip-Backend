const mongoose = require('mongoose');

const Delivery = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', Delivery);
