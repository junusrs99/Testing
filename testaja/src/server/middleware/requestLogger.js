const morgan = require('morgan');
const logger = require('../utils/logger');
const { config } = require('../config/config');

// Create a stream object with a 'write' function
const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Create morgan middleware
const requestLogger = morgan('combined', {
  stream,
  skip: (req, res) => {
    // Skip logging in test environment
    return config.nodeEnv === 'test';
  }
});

module.exports = requestLogger;

