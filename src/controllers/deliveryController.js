const Delivery = require('../models/Delivery');
const Driver = require('../models/Driver');

const { calculateDeliveryAmount, calculateDistance, setDeliveryType } = require('../helpers/delivery');
const { deliverySchema } = require('../helpers/validation');
const mail = require('../helpers/mail');

// Get all deliveries
const get = async (req, res, next) => {
  try {
    const result = await Delivery.find().populate('driver');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get available deliveries for a driver based on his truck type, delivery weight,
// availability (true), region (Local) and type (National)
const getBy = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ _id: req.user._id }).populate('truck');
    if (driver) {
      let minWeight;
      let maxWeight;
      switch (driver.truck.type) {
        case 'Light':
          minWeight = 0;
          maxWeight = 200;
          break;
        case 'Medium':
          minWeight = 201;
          maxWeight = 800;
          break;
        case 'Heavy':
          minWeight = 801;
          maxWeight = 1600;
          break;
        default:
          minWeight = 0;
          maxWeight = 200;
          break;
      }
      const response = await Delivery.find(
        {
          weight: { $gte: minWeight, $lte: maxWeight },
          region: 'Local',
          type: 'National',
          available: true,
          driver: { $exists: false },
        },
      );
      if (response.length > 0) {
        res.json(response);
      } else {
        res.json({ message: 'There is no available deliveries for you.' });
      }
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Get all deliveries claimed by a driver
const getClaimed = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ _id: req.user._id }).populate('truck');
    const response = await Delivery.find(
      {
        driver: driver._id,
        status: 'Claimed',
      },
    );
    if (response.length > 0) {
      res.json(response);
    } else {
      res.json({ message: 'You have not claimed any deliveries yet.' });
    }
  } catch (error) {
    next(error);
  }
};

// Get all deliveries claimed by a driver
const getDelivered = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ _id: req.user._id }).populate('truck');
    const response = await Delivery.find(
      {
        driver: driver._id,
        status: 'Delivered',
      },
    );
    if (response.length > 0) {
      res.json(response);
    } else {
      res.json({ message: 'You have not delivered any deliveries yet.' });
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
      const calculatedAmount = calculateDeliveryAmount(req.body.weight, req.body.region);
      const calculatedDistance = await calculateDistance(req.body.from, req.body.to);
      const deliveryType = setDeliveryType(req.body.region);
      const newDelivery = new Delivery({
        weight: req.body.weight,
        amount: calculatedAmount,
        region: req.body.region,
        from: req.body.from,
        to: req.body.to,
        distance: calculatedDistance,
        date: req.body.date,
        type: deliveryType,
      });
      const response = await newDelivery.save();
      __log.delivery(`(Created) : Delivery created by ${req.user.email}. ${req.body.weight} weight, ${calculatedAmount}dh of type ${deliveryType}. From ${req.body.from} to ${req.body.to} with a distance of ${calculatedDistance} set for ${req.body.date}.`);
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
    // Setup query to search for deliveries based on weight
    const deliveryQuery = (weightCriteria) => {
      const query = {
        weight: weightCriteria,
        available: false,
        driver: { $exists: false },
      };
      return query;
    };
    // Get deliveries by weight
    const lightDeliveries = await Delivery.find(deliveryQuery({ $lte: 200 }));
    const mediumDeliveries = await Delivery.find(deliveryQuery({ $gt: 200, $lte: 800 }));
    const heavyDeliveries = await Delivery.find(deliveryQuery({ $gt: 800, $lte: 1600 }));
    // Get drivers
    const drivers = await Driver.find().populate('truck');
    if (drivers.length > 0) {
      const result = drivers.reduce((emails, driver) => {
        const { type } = driver.truck;
        const emailsObj = emails;
        // eslint-disable-next-line no-cond-assign
        if (emailsObj[type] || (emailsObj[type] = [])) {
          emailsObj[type].push(driver.email);
        }
        return emailsObj;
      }, {});
      // Send emails to all drivers of each category if there are available deliveries for them
      if (lightDeliveries.length > 0) await mail(result.Light.join(', '), 'Light');
      if (mediumDeliveries.length > 0) await mail(result.Medium.join(', '), 'Medium');
      if (heavyDeliveries.length > 0) await mail(result.Heavy.join(', '), 'Heavy');
    }
    // Update all deliveries that are unavailable and are not claimed
    const updateQuery = {
      available: false,
      driver: { $exists: false },
    };
    const response = await Delivery.updateMany(
      updateQuery,
      {
        available: true,
      },
    );
    // This will leave deliveries that are already claimed unavailable
    if (response.modifiedCount !== 0) {
      __log.delivery('(Update) : deliveries are now available.');
      res.json({ message: 'Deliveries are now available and notification emails were sent.' });
    } else {
      __log.delivery('(Update) : there is no deliveries to update.');
      res.json({ message: 'There is no deliveries to update.' });
    }
  } catch (error) {
    next(error);
  }
};

// Claim a delivery by adding driver _id and make it unavailable (false)
const claim = async (req, res, next) => {
  // Get id from url parameters
  const { id: _id } = req.params;
  try {
    // Find driver connected query
    const findQuery = {
      _id: req.user._id,
    };
    // Find connected driver
    const driver = await Driver.findOne(findQuery);
    if (driver) {
      // Find if he already claimed/delivered the requested delivery
      const claimedQuery = {
        available: false,
        status: ['Claimed'],
        driver: req.user._id,
      };
      const claimedDelivery = await Delivery.findOne(claimedQuery);
      // If there is no claimed delivery continue
      if (!claimedDelivery) {
        // Update delivery query
        const updateQuery = {
          _id,
          available: true,
          status: 'Pending',
          driver: { $exists: false },
        };
        // Updated delivery data
        const updatedDelivery = {
          available: false,
          status: 'Claimed',
          driver: req.user._id,
        };
        const responseDelivery = await Delivery.findOneAndUpdate(
          updateQuery,
          { $set: updatedDelivery },
          { new: true },
        );
        if (responseDelivery) {
          __log.delivery(`(Claimed) : Delivery ${responseDelivery._id} was claimed by ${driver.email} and it's status was changed to 'Claimed'.`);
          res.json({ delivery: responseDelivery });
        } else {
          res.json({ message: 'There was a problem updating the delivery.' });
        }
      } else {
        res.json({ message: 'You have already claimed a delivery.' });
      }
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Change status of delivery to 'delivered' after confirming it
const delivered = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    // Update delivery status if it is not available and already claimed by a driver
    const updateQuery = {
      _id,
      available: false,
      driver: { $exists: true },
    };
    const updatedDelivery = {
      status: 'Delivered',
    };
    const responseDelivery = await Delivery.findOneAndUpdate(
      updateQuery,
      { $set: updatedDelivery },
      { new: true },
    );
    if (responseDelivery) {
      // Find driver of the delivery
      const driverQuery = {
        _id: responseDelivery.driver,
      };
      const driver = await Driver.findOne(driverQuery);
      if (driver) {
        // Update it's traveled distance and push the delivery to the deliveries array
        const updatedDriver = {
          distanceTraveled: driver.distanceTraveled + responseDelivery.distance,
        };
        const responseDriver = await Driver.findOneAndUpdate(
          driverQuery,
          {
            $set: updatedDriver,
            $push: { deliveries: responseDelivery._id },
          },
          { new: true },
        );
        __log.delivery(`(Delivered) : Delivery ${responseDelivery._id} was delivered by ${updatedDriver.email} and it's status was changed to 'Delivered' by Supervisor ${req.user.email}.`);
        res.json({ delivery: responseDelivery, driver: responseDriver });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getBy,
  getClaimed,
  getDelivered,
  create,
  update,
  claim,
  delivered,
};
