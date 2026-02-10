const logger = require('../utils/logger');
const ResponseHelper = require('../utils/response');
const ErrorCodes = require('../constants/errorCodes');

const errorHandler = (err, req, res, next) => {  
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Handle known errors
  if (err.statusCode) {
    return ResponseHelper.error(res, err, err.statusCode);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return ResponseHelper.validationError(res, err.errors);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const authError = new Error(ErrorCodes.AUTH_INVALID.message);
    authError.code = ErrorCodes.AUTH_INVALID.code;
    authError.statusCode = ErrorCodes.AUTH_INVALID.statusCode;
    return ResponseHelper.error(res, authError, authError.statusCode);
  }

  if (err.name === 'TokenExpiredError') {
    const authError = new Error(ErrorCodes.AUTH_EXPIRED.message);
    authError.code = ErrorCodes.AUTH_EXPIRED.code;
    authError.statusCode = ErrorCodes.AUTH_EXPIRED.statusCode;
    return ResponseHelper.error(res, authError, authError.statusCode);
  }

  // Default error
  return ResponseHelper.error(res, err);
};

module.exports = errorHandler;

