const schedule = require('node-schedule');
const Driver = require('../models/Driver');
const Bonus = require('../models/Bonus');

const job = schedule.scheduleJob({ date: 1, hour: 12 }, async () => {
  try {
    // Get all drivers with distance traveled only that made deliveries (with their amount only)
    const drivers = await Driver.find(
      { distanceTraveled: { $gt: 1000 }, deliveries: { $exists: true } },
      { distanceTraveled: 1, deliveries: 1 },
    ).populate(
      'deliveries',
      'amount',
    );
    if (drivers) {
      // Create array of bonuses based on the drivers array
      const bonuses = drivers.map((driver) => {
        // Get the total amount of all deliveries
        let amount = 0;
        driver.deliveries.forEach((delivery) => {
          amount += delivery.amount;
        });
        // Set multiplier based on driver's distance traveled
        const distance = driver.distanceTraveled;
        let bonusMultiplier;
        if (distance >= 1000 && distance < 2000) {
          bonusMultiplier = 15;
        } else if (distance >= 2000 && distance < 2500) {
          bonusMultiplier = 22;
        } else if (distance >= 2500) {
          bonusMultiplier = 30;
        }
        // Return with a bonus object
        return {
          multiplier: bonusMultiplier,
          totalDistance: driver.distanceTraveled,
          totalAmount: amount,
          bonusPay: (amount * bonusMultiplier) / 100,
          driver: driver._id,
        };
      });
      if (bonuses.length > 0) {
        await Bonus.create(bonuses);
        // Reset all drivers distance traveled and monthly deliveries
        await Driver.updateMany(
          {
            distanceTraveled: 0,
            deliveries: [],
          },
        );
        __log.info('Bonuses have been applied by Manager, and all Drivers distance and deliveries have been reset.');
        __log.info('Bonuses have been applied, and Drivers distance and deliveries have been reset.');
      } else {
        __log.info('There is no bonuses to apply.');
      }
    } else {
      __log.info('No Drivers that have made deliveries found.');
    }
  } catch (error) {
    __log.error('what');
  }
});

module.exports = job;
