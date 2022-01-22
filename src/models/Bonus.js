const mongoose = require('mongoose');

const Bonus = mongoose.Schema({
  multiplier: {
    type: Number,
    enum: [15, 22, 30],
    required: true,
  },
  totalDistance: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  bonusPay: {
    type: Number,
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
}, { timestamps: true });

module.exports = mongoose.model('Bonus', Bonus);
