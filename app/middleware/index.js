const cacheHeaders = require('./cache-headers');
const notFound = require('./not-found');
const stackLogger = require('./stack-logger');
const errorHandler = require('./error-handler');
const i18n = require('./i18n');

module.exports = {
  cacheHeaders,
  notFound,
  stackLogger,
  errorHandler,
  i18n,
};
