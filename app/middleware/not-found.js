const message = 'Not Found';
const statusCode = 404;

module.exports = (req, res, next) => {
  const err = new Error(message);
  err.status = statusCode;
  next(err);
};
