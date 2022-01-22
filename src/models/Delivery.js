const mongoose = require('mongoose');

const Delivery = mongoose.Schema({
  weight: {
    type: Number,
    required: true,
    max: 1600,
  },
  amount: {
    type: Number,
    required: true,
  },
  region: {
    type: String,
    enum: ['Local', 'Europe', 'America', 'Asia', 'Australia'],
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
  distance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['National', 'International'],
    required: true,
  },
  available: {
    type: Boolean,
    default: false,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Claimed', 'Delivered'],
    default: 'Pending',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', Delivery);
