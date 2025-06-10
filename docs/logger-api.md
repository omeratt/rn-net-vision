# NetVision Logger API Reference

The NetVision logger provides a consistent logging interface across all environments (JavaScript/TypeScript, iOS, Android) with production mode control.

## JavaScript/TypeScript API

### Configuration

```javascript
// netvision.config.js
module.exports = {
  isProduction: false, // Set to true to disable all logs
};
```

### Basic Usage

```javascript
import logger from '@omeratt/rn-net-vision/logger';

// Log levels
logger.debug('Debug information (lowest level)');
logger.info('Information messages');
logger.warn('Warning messages');
logger.error('Error messages (highest level)');
```

### Initializing in React Native

```javascript
import { initializeLogger } from '@omeratt/rn-net-vision';

// Call this early in your app initialization
async function setupApp() {
  await initializeLogger();
  // Rest of your app initialization
}
```

## iOS Native API

### Basic Usage

```swift
import NetVisionLogger

// Log levels
NetVisionLogger.shared.debug("Debug information")
NetVisionLogger.shared.info("Information messages")
NetVisionLogger.shared.warn("Warning messages")
NetVisionLogger.shared.error("Error messages")

// You can also use the generic log method with explicit level
NetVisionLogger.shared.log(level: .debug, message: "Custom debug message")
```

## Android Native API

### Basic Usage

```kotlin
import com.omeratt.rnnetvision.NetVisionLogger

// Log levels
NetVisionLogger.instance.debug("Debug information")
NetVisionLogger.instance.info("Information messages")
NetVisionLogger.instance.warn("Warning messages")
NetVisionLogger.instance.error("Error messages")

// You can also use the generic log method with explicit level
NetVisionLogger.instance.log(LogLevel.DEBUG, "Custom debug message")
```

## Best Practices

1. Use appropriate log levels:

   - `debug`: For detailed troubleshooting information
   - `info`: For general operational information
   - `warn`: For potential issues that aren't errors
   - `error`: For errors that may require attention

2. Toggle production mode in netvision.config.js:

   - Development: `isProduction: false`
   - Production: `isProduction: true`

3. Include relevant context in log messages
   - Be specific about what's happening
   - Include identifiers when logging objects or operations
