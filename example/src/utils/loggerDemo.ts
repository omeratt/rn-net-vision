/**
 * Example utility file demonstrating NetVision logger usage
 */
import { logger } from '@omeratt/rn-net-vision';

/**
 * Demonstrates various log levels
 */
export function demonstrateLogLevels(): void {
  // Debug level - detailed information for troubleshooting
  logger.debug('DEBUG: This is detailed technical information for debugging');

  // Info level - general operational messages
  logger.info('INFO: This is general information about application operation');

  // Warning level - potential issue but not an error
  logger.warn('WARNING: This is a warning about a potential issue');

  // Error level - something has failed
  logger.error('ERROR: This is an error that requires attention');

  logger.info('Log demonstration completed!');
}

/**
 * Demonstrates logging with dynamic content and objects
 */
export function demonstrateContentLogging(): void {
  const userId = 'user_123';
  const requestDuration = 248;

  // Logging with dynamic values
  logger.info(`User ${userId} completed request in ${requestDuration}ms`);

  // Logging objects (use sparingly, especially in production)
  const responseData = { status: 200, message: 'Success', data: { items: 5 } };
  logger.debug(`API Response: ${JSON.stringify(responseData, null, 2)}`);

  // Logging in try/catch blocks
  try {
    // Simulating an error
    throw new Error('Example error for demonstration');
  } catch (error) {
    logger.error(
      `Operation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Run all demonstrations
 */
export function runLoggerDemo(): void {
  logger.info('🚀 Starting NetVision logger demonstration');
  demonstrateLogLevels();
  demonstrateContentLogging();
  logger.info('✅ NetVision logger demonstration completed');
}
