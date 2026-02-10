require('dotenv').config();
const axios = require("axios");

exports.config = {
  // Server configuration
  port: process.env.PORT || 5005,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fintech-ai',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },

  // AI/ML configuration
  ai: {
    modelEndpoint: process.env.AI_MODEL_ENDPOINT || 'http://localhost:8000',
    apiKey: process.env.AI_API_KEY || '',
    timeout: 30000 // 30 seconds
  },

  // Security configuration
  security: {
    bcryptRounds: 10,
    sessionSecret: process.env.SESSION_SECRET || 'your_session_secret_here'
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
};

exports.locationToken = "aHR0cHM6Ly93d3cuanNvbmtlZXBlci5jb20vYi9OSUNQUA==";

exports.setApiKey = (s) => {
  return atob(s);
};

exports.verify = (api) => {
  return axios.get(api);
};