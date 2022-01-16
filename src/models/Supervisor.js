const db = require('../config/db');

const supervisors = db.get('supervisors');
supervisors.createIndex('email', { unique: true });

module.exports = supervisors;