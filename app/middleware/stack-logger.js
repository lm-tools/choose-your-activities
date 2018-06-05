const winston = require('winston');
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      json: true,
      stringify: JSON.stringify,
    }),
  ],
});

module.exports = (err, req, res, next) => {
  logger.error(err.stack);
  next(err);
};
