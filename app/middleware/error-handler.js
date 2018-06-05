const i18n = require('i18n');

const isValidationError = err => err.isJoi;

const statusCodes = {
  validationFailure: 400,
  serverError: 500,
};

module.exports = displayRawError =>
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    if (isValidationError(err)) {
      Object.assign(err, { status: statusCodes.validationFailure });
    }

    const status = err.status || statusCodes.serverError;

    // eslint-disable-next-line no-underscore-dangle
    const model = { message: i18n.__(`error.${status}`) };

    if (displayRawError) {
      model.error = { message: err.message, status, stack: err.stack };
    }

    res.status(status);
    res.render('error', model);
  };
