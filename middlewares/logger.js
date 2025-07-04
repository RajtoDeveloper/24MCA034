const logAPI = require('../utils/logService');

const logger = async (req, res, next) => {
  const msg = `Received ${req.method} request to ${req.originalUrl}`;
  await logAPI("backend", "info", "middleware", msg);
  next();
};

module.exports = logger;
