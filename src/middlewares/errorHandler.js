/* eslint-disable no-unused-vars */
const Handler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  if (process.env.NODE_ENV !== 'production') {
    res.json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.json({
      message: err.message,
    });
  }
  __log.error(err.message);
};

module.exports = Handler;
