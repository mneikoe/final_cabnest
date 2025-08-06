const logger = require("../utils/logger");

// Log every incoming request
const requestLogger = (req, res, next) => {
  logger.info(
    `[REQ] ${req.method} ${req.originalUrl} - IP: ${
      req.ip
    } - At: ${new Date().toISOString()}`
  );
  next();
};

// Centralized error logger — call next(err) for error handling
const errorLogger = (err, req, res, next) => {
  logger.error(
    `[ERR] ${req.method} ${req.originalUrl} - IP: ${req.ip} - Message: ${err.message}\nStack: ${err.stack}`
  );
  next(err); // Pass error to Express error handler or your existing error middleware
};

module.exports = { requestLogger, errorLogger };
