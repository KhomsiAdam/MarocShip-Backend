const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('../helpers/logger');

const Truck = require('../models/Truck');

const {
  DB_USER, DB_PASS, DB_CLUSTER, DB_NAME,
} = process.env;

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}.tdwf4.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const seedTrucks = async () => {
  mongoose.connect(DB_URI, async () => {
    try {
      await Truck.collection.drop();
      const trucks = await Truck.create([
        {
          type: 'Light',
          brand: 'Chevrolet',
          model: 'NHR',
        },
        {
          type: 'Light',
          brand: 'Hyundai',
          model: 'Mighty',
        },
        {
          type: 'Light',
          brand: 'Isuzu',
          model: 'Elf',
        },
        {
          type: 'Light',
          brand: 'Mercedes-Benz',
          model: 'Sprinter',
        },
        {
          type: 'Light',
          brand: 'Mercedes-Benz',
          model: 'Atego',
        },
        {
          type: 'Light',
          brand: 'Mitsubishi',
          model: 'Canter',
        },

        {
          type: 'Medium',
          brand: 'Mercedes-Benz',
          model: 'Axor',
        },
        {
          type: 'Medium',
          brand: 'Isuzu',
          model: 'Forward',
        },
        {
          type: 'Medium',
          brand: 'Mitsubishi',
          model: 'Fighter',
        },
        {
          type: 'Heavy',
          brand: 'Mitsubishi',
          model: 'Super Great',
        },
        {
          type: 'Heavy',
          brand: 'Mercedes-Benz',
          model: 'Arocs',
        },
        {
          type: 'Heavy',
          brand: 'Isuzu',
          model: 'Giga',
        },
        {
          type: 'Heavy',
          brand: 'Ford',
          model: 'F-MAX',
        },
        {
          type: 'Heavy',
          brand: 'Hyundai',
          model: 'Xcient',
        },
      ]);
      if (trucks) {
        logger.info('Trucks created!');
        mongoose.disconnect();
      } else {
        logger.info('Trucks already exists!');
        mongoose.disconnect();
      }
    } catch (error) {
      logger.error(error);
      mongoose.disconnect();
    }
  });
};

seedTrucks();
