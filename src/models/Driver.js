const mongoose = require('mongoose');

const Driver = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  distanceTraveled: {
    type: Number,
    default: 0,
  },
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
  },
  deliveries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    default: [],
  }],
}, { timestamps: true });

module.exports = mongoose.model('Driver', Driver);
