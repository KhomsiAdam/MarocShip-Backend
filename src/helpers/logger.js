const winston = require('winston');

const levels = {
  delivery: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  delivery: 'cyan',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'magenta',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), format),
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
  new winston.transports.File({
    filename: 'logs/deliveries.log',
    level: 'delivery',
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger;
