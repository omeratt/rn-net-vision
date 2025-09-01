# @omeratt/rn-net-vision
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/81be7512-eb31-43b7-be98-e9fd3c93df85" />


![License](https://img.shields.io/npm/l/@omeratt/rn-net-vision)
![npm package](https://img.shields.io/npm/v/@omeratt/rn-net-vision)

A lightweight native module for React Native that provides real-time network monitoring and debugging through an intuitive web interface. Inspect HTTP/HTTPS requests, analyze responses, and troubleshoot API issues with ease - all within your development environment.

## Features

- 🔍 Real-time HTTP/HTTPS request inspection
- 📊 Detailed request and response analysis
- 📱 Multi-device support with device filtering
- 🚀 Low-overhead performance impact
- 🌐 User-friendly web interface
- 📱 Works with iOS and Android
- 🔄 Automatic request/response body parsing
- ⚡ Metro integration for seamless development

## Screenshots
<img width="1600" height="1215" alt="1_jWIyleLMrxdDM-Wwx_9KrQ" src="https://github.com/user-attachments/assets/9866fbd6-1d2b-465b-b113-72aa057f2e0f" />

<!-- Add your screenshots here when available -->


## Installation

### Using npm

```sh
npm install @omeratt/rn-net-vision --save-dev
```

### Using yarn

```sh
yarn add @omeratt/rn-net-vision --dev
```

## Setup

NetVision requires a few configuration steps to work properly in your React Native project:

### 1. Configure Metro

You need to update your `metro.config.js` file to include the NetVision middleware. This allows NetVision to intercept and monitor network requests.

```js
// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');
const { withNetVision } = require('@omeratt/rn-net-vision/metro');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 */
const config = getDefaultConfig(__dirname);

// Apply NetVision middleware to Metro
module.exports = withNetVision(config, __dirname);
```

### 2. Add the hook to your App component

Import and use the `useNetVision` hook in your main App component:

```jsx
// App.js or App.tsx
import { useNetVision } from '@omeratt/rn-net-vision';
import React from 'react';
import { View, Text } from 'react-native';

function App() {
  // Initialize NetVision at the root of your app
  useNetVision();

  return (
    <View>
      <Text>Your App</Text>
    </View>
  );
}

export default App;
```

## Usage

Once NetVision is set up, you can access your network debugging interface through:

1. **Dev menu**: When you shake your device or press `Cmd+D` (iOS simulator) or `Cmd+M` (Android emulator), you'll see the option "🕵️ Start NetVision" in the developer menu.

2. **Automatic monitoring**: With the `useNetVision` hook in place, all network requests will be automatically monitored, and you can view them in the NetVision interface.

### Programmatic Usage

You can also start NetVision programmatically:

```js
import {
  startNetVision,
  registerNetVisionDevMenu,
} from '@omeratt/rn-net-vision';

// Register NetVision in the dev menu
registerNetVisionDevMenu();

// Start NetVision programmatically
startNetVision();
```

## Web Interface

The NetVision web interface provides a clean, intuitive dashboard for monitoring network requests:

- **Request list**: View all captured requests with status codes and timing information
- **Request details**: Inspect headers, payloads, and response data
- **Filtering**: Filter requests by URL, status code, or method
- **Persistence**: Data persists across app reloads during the same debugging session

The web interface automatically opens in your default browser when NetVision is started.

## Configuration

You can create a `netvision.config.js` file in your project root to customize NetVision's behavior:

```js
// netvision.config.js
module.exports = {
  isProduction: false, // Set to true if building for production
  // Additional configuration options coming soon
};
```

## Logging System

NetVision includes a cross-platform logging system that works consistently across JavaScript/TypeScript, iOS, and Android environments.

### Basic Usage

```javascript
// JavaScript/TypeScript
import logger from '@omeratt/rn-net-vision/logger';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');

// Initialize logger at app startup
import { initializeLogger } from '@omeratt/rn-net-vision';
await initializeLogger();
```

```swift
// iOS (Swift)
import NetVisionLogger

NetVisionLogger.shared.debug("Debug message")
NetVisionLogger.shared.info("Info message")
```

```kotlin
// Android (Kotlin)
import com.omeratt.rnnetvision.NetVisionLogger

NetVisionLogger.instance.debug("Debug message")
NetVisionLogger.instance.info("Info message")
```

For detailed logging documentation, see [Logger API](docs/logger-api.md) and [Logging Strategy](LOGGING.md).

## Troubleshooting

### Common Issues

- **NetVision not capturing requests**: Make sure you've properly set up the Metro middleware and added the `useNetVision` hook.
- **Web interface not opening**: Check that ports 8088 and 5173 are available on your system.
- **Only capturing partial request data**: Some third-party libraries may use custom networking implementations that bypass the standard networking stack.

## Advanced Features

#### Multi-Device Management

RN Net Vision supports monitoring multiple devices simultaneously:

- 📱 Connect multiple iOS and Android devices to debug at once
- 🔄 Device auto-detection with platform identification
- 🔍 Filter network logs by specific device
- 🚦 Real-time device connection status

When multiple devices are connected, use the device selector in the web viewer to filter logs by device.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with ❤️ by [Omer Attias](https://github.com/omeratt)
