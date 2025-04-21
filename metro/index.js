// metro/index.js
const path = require('path');
const enhanceMetroMiddleware = require('./enhanceMetroMiddleware');

function withNetVision(config, projectRoot = process.cwd()) {
  config.server = config.server || {};
  config.server.enhanceMiddleware = enhanceMetroMiddleware({ projectRoot });

  console.log('✅ [NetVision] Middleware injected via withNetVision');
  return config;
}

module.exports = { withNetVision };
