import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { initializeLogger, logger } from '@omeratt/rn-net-vision';

// Initialize the logger at app startup
const setup = async () => {
  try {
    logger.info('Initializing NetVision logger...');
    await initializeLogger();
    logger.info('✅ NetVision logger initialized successfully');
  } catch (error) {
    logger.error(`❌ Failed to initialize logger: ${error}`);
  }
};

// Run setup
setup();

AppRegistry.registerComponent(appName, () => App);
