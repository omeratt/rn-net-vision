// metro/index.js
const enhanceMetroMiddleware = require('./enhanceMetroMiddleware');
const logger = require('../logger');

function withNetVision(config, projectRoot = process.cwd()) {
  config.server = config.server || {};
  config.server.enhanceMiddleware = enhanceMetroMiddleware({ projectRoot });

  logger.info('✅ Middleware injected via withNetVision');
  return config;
}

module.exports = { withNetVision };
