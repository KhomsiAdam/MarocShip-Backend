const monk = require('monk');

const db = monk(process.env.DB_URI);

module.exports = db;
