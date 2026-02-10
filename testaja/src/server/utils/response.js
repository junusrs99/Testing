const HttpStatus = require('../constants/httpStatus');

class ResponseHelper {
  static success(res, data, message = 'Success', statusCode = HttpStatus.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, error, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    const message = error.message || 'Internal server error';
    const code = error.code || 'INTERNAL_SERVER_ERROR';

    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message
      },
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  static validationError(res, errors) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors
      }
    });
  }

  static notFound(res, resource = 'Resource') {
    return res.status(HttpStatus.NOT_FOUND).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `${resource} not found`
      }
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message
      }
    });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message
      }
    });
  }
}

module.exports = ResponseHelper;

