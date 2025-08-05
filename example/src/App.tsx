// import { registerNetVisionDevMenu } from '@omeratt/rn-net-vision';
import { useNetVision, initializeLogger, logger } from '@omeratt/rn-net-vision';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// import { fetch, type ReactNativeSSLPinning } from 'react-native-ssl-pinning';

const fetchTo = (
  url: string,
  options: any
  // options: Omit<ReactNativeSSLPinning.Options, 'sslPinning'>
) => {
  // Example of debug level logging - detailed technical information
  logger.debug(
    `Making network request to: ${url} with method: ${options.method || 'GET'}`
  );
  return fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'platform': 'mobile',
    },
    sslPinning: {
      certs: ['stringisracard24'],
    },
  });
};

export default function App() {
  useNetVision();

  useEffect(() => {
    // Initialize the logger when the app starts
    const setupLogger = async () => {
      logger.info('Setting up NetVision logger...');
      try {
        await initializeLogger();
        logger.info('✅ NetVision logger initialized successfully');
      } catch (error) {
        logger.error(`❌ Failed to initialize logger: ${error}`);
      }
    };

    setupLogger();

    // Example network requests with logging
    logger.debug('Starting network requests');
    fetchTo('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Hello NetVision',
        body: 'This is a test request body',
        userId: 123,
      }),
    }).then(() => logger.debug('POST request completed'));

    fetchTo('https://string.isracard.co.il/DigitalShell.MobileTestBE/GetTest', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        logger.info('Request succeeded with response:');
        logger.info(JSON.stringify(res, null, 2));
      })
      .catch((error) => {
        logger.warn(`Network request failed: ${error}`);
      });

    fetchTo('https://sellme.app/feed', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => logger.debug('Feed request completed'));

    fetchTo('https://jsonplaceholder.typicode.com/posts/1', {}).then(() =>
      logger.debug('GET post request completed')
    );
  }, []);

  // Demo functions to show logger usage
  const logDebugMessage = () => {
    logger.debug(
      'This is a debug message - detailed information for debugging'
    );
    return true;
  };

  const logInfoMessage = () => {
    logger.info(
      'This is an info message - general information about app operation'
    );
    return true;
  };

  const logWarningMessage = () => {
    logger.warn(
      'This is a warning message - something might be wrong but operation continues'
    );
    return true;
  };

  const logErrorMessage = () => {
    logger.error('This is an error message - something has failed');
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome To Net Vision!</Text>
      <Text style={styles.subtitle}>Logger Demo</Text>

      <View style={styles.buttonContainer}>
        <Button title="Debug Log" onPress={logDebugMessage} />
        <Button title="Info Log" onPress={logInfoMessage} />
        <Button title="Warning Log" onPress={logWarningMessage} />
        <Button title="Error Log" onPress={logErrorMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 32,
    color: '#000',
    letterSpacing: 2,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
    justifyContent: 'space-between',
    height: 200,
  },
});
