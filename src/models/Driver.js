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
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
}, { timestamps: true });

module.exports = mongoose.model('Driver', Driver);
