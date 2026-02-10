// Error codes and messages
const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: {
    code: 'AUTH_REQUIRED',
    message: 'Authentication required',
    statusCode: 401
  },
  AUTH_INVALID: {
    code: 'AUTH_INVALID',
    message: 'Invalid authentication credentials',
    statusCode: 401
  },
  AUTH_EXPIRED: {
    code: 'AUTH_EXPIRED',
    message: 'Authentication token expired',
    statusCode: 401
  },
  AUTH_FORBIDDEN: {
    code: 'AUTH_FORBIDDEN',
    message: 'Access forbidden',
    statusCode: 403
  },

  // User errors
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    statusCode: 404
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'User already exists',
    statusCode: 400
  },
  USER_INVALID_CREDENTIALS: {
    code: 'USER_INVALID_CREDENTIALS',
    message: 'Invalid email or password',
    statusCode: 401
  },

  // Financial data errors
  FINANCIAL_DATA_NOT_FOUND: {
    code: 'FINANCIAL_DATA_NOT_FOUND',
    message: 'Financial data not found',
    statusCode: 404
  },
  INVALID_TRANSACTION: {
    code: 'INVALID_TRANSACTION',
    message: 'Invalid transaction data',
    statusCode: 400
  },
  INSUFFICIENT_FUNDS: {
    code: 'INSUFFICIENT_FUNDS',
    message: 'Insufficient funds',
    statusCode: 400
  },

  // AI/ML errors
  AI_SERVICE_UNAVAILABLE: {
    code: 'AI_SERVICE_UNAVAILABLE',
    message: 'AI service is currently unavailable',
    statusCode: 503
  },
  AI_PROCESSING_ERROR: {
    code: 'AI_PROCESSING_ERROR',
    message: 'Error processing AI request',
    statusCode: 500
  },

  // Validation errors
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation error',
    statusCode: 400
  },
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    message: 'Invalid input data',
    statusCode: 400
  },

  // Server errors
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    statusCode: 500
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service temporarily unavailable',
    statusCode: 503
  },

  // Rate limiting
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later',
    statusCode: 429
  }
};

module.exports = ErrorCodes;

