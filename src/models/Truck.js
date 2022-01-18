const mongoose = require('mongoose');

const Truck = mongoose.Schema({
  type: {
    type: String,
    enum: ['Light', 'Medium', 'Heavy'],
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

module.exports = mongoose.model('Truck', Truck);
