const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { config } = require('./config/config');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
require('express-async-errors');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: config.rateLimit.message
});
app.use('/api/', limiter);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/financial', require('./routes/financial'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/scenarios', require('./routes/scenarios'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/achievements', require('./routes/achievements'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Fintech AI Platform API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`info: Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
