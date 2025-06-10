// Import from NetVision package
import { useNetVision, logger } from '@omeratt/rn-net-vision';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { fetch, type ReactNativeSSLPinning } from 'react-native-ssl-pinning';
import { runLoggerDemo } from './utils/loggerDemo';

const fetchTo = (
  url: string,
  options: Omit<ReactNativeSSLPinning.Options, 'sslPinning'>
) => {
  logger.debug(`Making request to: ${url}`);
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
    // Demo logger usage
    logger.info('App started');

    // Example network requests with logging
    fetchTo('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Hello NetVision',
        body: 'This is a test request body',
        userId: 123,
      }),
    });

    fetchTo('https://jsonplaceholder.typicode.com/posts/1', {});
  }, []);

  // Demo function to run logger demonstrations
  const handleRunDemo = () => {
    logger.info('Running logger demo...');
    runLoggerDemo();
  };

  // Different log level examples
  const logDebug = () => logger.debug('This is a debug message');
  const logInfo = () => logger.info('This is an info message');
  const logWarn = () => logger.warn('This is a warning message');
  const logError = () => logger.error('This is an error message');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>NetVision Logger Demo</Text>

      <View style={styles.buttonContainer}>
        <Button title="Run Full Demo" onPress={handleRunDemo} />
        <View style={styles.separator} />
        <Button title="Debug Log" onPress={logDebug} />
        <Button title="Info Log" onPress={logInfo} />
        <Button title="Warning Log" onPress={logWarn} />
        <Button title="Error Log" onPress={logError} />
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
    fontSize: 28,
    color: '#000',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  separator: {
    height: 20,
  },
});
