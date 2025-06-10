// logger.js - JavaScript logger for NetVision
const config = require('./netvision.config');

/**
 * Log levels mapping
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

/**
 * Visual prefixes for different log levels
 */
const LEVEL_PREFIXES = {
  [LOG_LEVELS.DEBUG]: '🔍',
  [LOG_LEVELS.INFO]: 'ℹ️',
  [LOG_LEVELS.WARN]: '⚠️',
  [LOG_LEVELS.ERROR]: '❌',
  [LOG_LEVELS.NONE]: '',
};

/**
 * NetVision Logger for JavaScript files
 */
class NetVisionJsLogger {
  constructor() {
    this.isProduction = false;
  }

  /**
   * Configure the logger
   * @param {boolean} isProduction - Whether the app is running in production mode
   */
  configure(isProduction) {
    this.isProduction = isProduction;
    this.log(LOG_LEVELS.INFO, `Logger configured: production=${isProduction}`);
  }

  /**
   * Generic log method
   * @param {number} level - Log level from LOG_LEVELS
   * @param {string} message - Message to log
   */
  log(level, message) {
    // Skip all logs in production mode
    if (this.isProduction) {
      return;
    }

    const prefix = LEVEL_PREFIXES[level] || '';
    const messageWithPrefix = `${prefix} [NetVision] ${message}`;

    switch (level) {
      case LOG_LEVELS.DEBUG:
        console.debug(messageWithPrefix);
        break;
      case LOG_LEVELS.INFO:
        console.info(messageWithPrefix);
        break;
      case LOG_LEVELS.WARN:
        console.warn(messageWithPrefix);
        break;
      case LOG_LEVELS.ERROR:
        console.error(messageWithPrefix);
        break;
      default:
        console.log(messageWithPrefix);
    }
  }

  /**
   * Debug level log
   * @param {string} message - Message to log
   */
  debug(message) {
    this.log(LOG_LEVELS.DEBUG, message);
  }

  /**
   * Info level log
   * @param {string} message - Message to log
   */
  info(message) {
    this.log(LOG_LEVELS.INFO, message);
  }

  /**
   * Warning level log
   * @param {string} message - Message to log
   */
  warn(message) {
    this.log(LOG_LEVELS.WARN, message);
  }

  /**
   * Error level log
   * @param {string} message - Message to log
   */
  error(message) {
    this.log(LOG_LEVELS.ERROR, message);
  }
}

// Export singleton instance
const logger = new NetVisionJsLogger();
logger.configure(config.isProduction);

// Export logger instance as default and LOG_LEVELS as a property
module.exports = logger;
module.exports.LOG_LEVELS = LOG_LEVELS;
