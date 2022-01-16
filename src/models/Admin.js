const db = require('../config/db');

const admin = db.get('admin');
admin.createIndex('email', { unique: true });

module.exports = admin;