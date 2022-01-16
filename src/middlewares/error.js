// Error Handler
const Handler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  if (process.env.NODE_ENV !== 'production') {
    res.json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.json({
      message: err.message
    });
  }
  __log.error(err.message);
}

// NotFound
const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

module.exports = {
  Handler,
  notFound
};