const db = require('../config/db');

const managers = db.get('managers');
managers.createIndex('email', { unique: true });

module.exports = managers;