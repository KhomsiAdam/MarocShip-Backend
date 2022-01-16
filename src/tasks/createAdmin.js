const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const logger = require('../helpers/logger');
require('dotenv').config();

const Admin = require('../models/Admin');

const {DB_USER, DB_PASS, DB_CLUSTER, DB_NAME, ADMIN_EMAIL, ADMIN_PASSWORD} = process.env;

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}.tdwf4.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

const createAdmin = async () => {
  mongoose.connect(DB_URI, { useNewUrlParser: true }, async () => {
    try {
      const user = await Admin.findOne({ email: ADMIN_EMAIL });
      if (!user) {
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
        const admin = new Admin({
          email: ADMIN_EMAIL,
          password: hashed
        })
        await admin.save();
        logger.info('Admin user created!');
        mongoose.disconnect();
      } else {
        logger.info('Admin user already exists!');
        mongoose.disconnect();
      }
    } catch (error) {
      logger.error(error);
      mongoose.disconnect();
    }
  });
}

createAdmin();