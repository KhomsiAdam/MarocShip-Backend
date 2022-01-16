const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('../config/db');

const Admin = require('../models/Admin');

async function createAdmin() {
  try {
    const user = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!user) {
      await Admin.insert({
        email: process.env.ADMIN_EMAIL,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
      });
      __log.info('Admin user created!');
    } else {
      __log.info('Admin user already exists!');
    }
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
}

createAdmin();