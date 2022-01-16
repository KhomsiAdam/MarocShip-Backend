const db = require('../config/db');

const drivers = db.get('drivers');
drivers.createIndex('email', { unique: true });

module.exports = drivers;