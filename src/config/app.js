// Setup the global Winston logger
global.__log = require('../helpers/logger');

const express = require('express');

// Middlewares (import)
// const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('../middlewares/morgan');
const notFound = require('../middlewares/notFound');
const errorHandler = require('../middlewares/errorHandler');

require('dotenv').config();

const app = express();

// Routes
const adminRoutes = require('../routes/adminRoutes');
const managerRoutes = require('../routes/managerRoutes');
const supervisorRoutes = require('../routes/supervisorRoutes');
const driverRoutes = require('../routes/driverRoutes');

// Middlewares (use)
// app.use(cors({
//   origin: process.env.CLIENT_ORIGIN,
//   credentials: true
// }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan);

// Endpoints
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/supervisor', supervisorRoutes);
app.use('/driver', driverRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;