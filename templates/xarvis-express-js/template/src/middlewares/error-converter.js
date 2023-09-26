const httpStatus = require('http-status');
const ApiError = require('../utils/api-error');

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, err.stack);
  }

  next(error);
};

module.exports = errorConverter;
