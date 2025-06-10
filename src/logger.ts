import { NativeModules } from 'react-native';

// Import with proper type declaration
const config: { isProduction: boolean } = require('../netvision.config');

const { RnNetVision } = NativeModules;

/**
 * Log levels mapping
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Visual prefixes for different log levels
 */
const LEVEL_PREFIXES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '🔍',
  [LogLevel.INFO]: 'ℹ️',
  [LogLevel.WARN]: '⚠️',
  [LogLevel.ERROR]: '❌',
  [LogLevel.NONE]: '',
};

/**
 * NetVision Logger for TypeScript/JavaScript files
 */
class NetVisionLogger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = config.isProduction;
  }

  /**
   * Generic log method
   * @param level - Log level from LogLevel
   * @param message - Message to log
   */
  log(level: LogLevel, message: string): void {
    // Skip all logs in production mode
    if (this.isProduction) {
      return;
    }

    const prefix = LEVEL_PREFIXES[level] || '';
    const messageWithPrefix = `${prefix} [NetVision] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(messageWithPrefix);
        break;
      case LogLevel.INFO:
        console.info(messageWithPrefix);
        break;
      case LogLevel.WARN:
        console.warn(messageWithPrefix);
        break;
      case LogLevel.ERROR:
        console.error(messageWithPrefix);
        break;
      default:
        console.log(messageWithPrefix);
    }
  }

  /**
   * Debug level log
   */
  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  /**
   * Info level log
   */
  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  /**
   * Warning level log
   */
  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  /**
   * Error level log
   */
  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }
}

// Create and export singleton instance
const logger = new NetVisionLogger();
export default logger;

/**
 * Initialize the logger with debug/production mode
 * @returns {Promise<void>}
 */
export const initializeLogger = async (): Promise<void> => {
  try {
    // Initialize with production/debug flag only
    await RnNetVision.configureLogger(config.isProduction);

    logger.info(
      `Logger initialized: ${config.isProduction ? 'production mode (logs disabled)' : 'debug mode (logs enabled)'}`
    );
  } catch (error) {
    logger.error(`Failed to initialize logger: ${error}`);
  }
};
