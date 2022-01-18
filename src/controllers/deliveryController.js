const Joi = require('joi');

const Delivery = require('../models/Delivery');

// Delivery schema for validation
const deliverySchema = Joi.object({
  weight: Joi.number()
    .positive()
    .required(),

  amount: Joi.number()
    .positive(),

  region: Joi.string()
    .alphanum()
    .trim()
    .valid('Local', 'Europe', 'America', 'Asia', 'Australia')
    .required(),

  from: Joi.string()
    .alphanum()
    .trim()
    .required(),

  to: Joi.string()
    .alphanum()
    .trim()
    .required(),

  date: Joi.date()
    .min('now')
    .required(),

  type: Joi.string()
    .alphanum()
    .trim(),

  available: Joi.boolean(),

  driver: Joi.string()
    .alphanum()
    .trim(),
});

// Get all deliveries
const get = async (req, res, next) => {
  try {
    const result = await Delivery.find().populate('driver');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Calculate amount of delivery based on its weight and region
const calculateDeliveryAmount = (weight, region) => {
  let amount = 0;
  switch (region) {
    case 'Europe':
      amount = weight * 160;
      break;
    case 'America':
      amount = weight * 220;
      break;
    case 'Asia':
      amount = weight * 240;
      break;
    case 'Australia':
      amount = weight * 260;
      break;
    default:
      if (weight > 3) {
        const updatedWeight = weight - 3;
        const updatedAmount = updatedWeight * 5;
        amount = updatedAmount + 120;
      } else {
        amount = weight * 40;
      }
      break;
  }
  return amount;
};

const setDeliveryType = (region) => {
  const type = region !== 'Local' ? 'International' : 'National';
  return type;
};

// Create a delivery
const create = async (req, res, next) => {
  try {
    const result = deliverySchema.validate(req.body);
    if (!result.error) {
      const newDelivery = new Delivery({
        weight: req.body.weight,
        amount: calculateDeliveryAmount(req.body.weight, req.body.region),
        region: req.body.region,
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        type: setDeliveryType(req.body.region),
      });

      await newDelivery.save();
      res.json({ message: 'Delivery was created successfully.' });
    } else {
      res.status(422);
      __log.error(result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// Update delivery
const updateOne = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const result = deliverySchema.validate(req.body);
    if (!result.error) {
      const query = { _id };
      const delivery = await Delivery.findOne(query);
      if (delivery) {
        const updatedDelivery = req.body;
        const response = await Delivery.findOneAndUpdate(query, {
          $set: updatedDelivery,
        }, { new: true }).select('-password');
        res.json(response);
      } else {
        next();
      }
    } else {
      res.status(422);
      __log.error(result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  create,
  updateOne,
};
