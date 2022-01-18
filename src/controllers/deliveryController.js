const Delivery = require('../models/Delivery');
const Driver = require('../models/Driver');

const { calculateDeliveryAmount, setDeliveryType } = require('../helpers/delivery');
const { deliverySchema } = require('../helpers/validation');

// Get all deliveries
const get = async (req, res, next) => {
  try {
    const result = await Delivery.find().populate('driver');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getBy = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ _id: req.user._id }).populate('truck');
    if (driver) {
      let minAmount;
      switch (driver.truck.type) {
        case 'Light':
          minAmount = 200;
          break;
        case 'Medium':
          minAmount = 800;
          break;
        case 'Heavy':
          minAmount = 1600;
          break;
        default:
          minAmount = 200;
          break;
      }
      const response = await Delivery.find(
        {
          weight: { $lte: minAmount },
          region: 'Local',
          type: 'National',
          available: true,
          driver: { $exists: false },
        },
      );
      res.json(response);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Create delivery, calculate amount based on weight and region, set delivery type based on region
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
      const response = await newDelivery.save();
      res.json({ message: 'Delivery was created successfully.', delivery: response });
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

// Update all deliveries that are not available (false) and have no driver to available (true)
const update = async (req, res, next) => {
  try {
    const response = await Delivery.updateMany(
      {
        available: false,
        driver: { $exists: false },
      },
      {
        available: true,
      },
    );
    // This will leave deliveries that are already claimed unavailable
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getBy,
  create,
  update,
};
