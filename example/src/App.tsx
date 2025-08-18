// import { registerNetVisionDevMenu } from '@omeratt/rn-net-vision';
import { useNetVision, initializeLogger, logger } from '@omeratt/rn-net-vision';
import { useEffect, useState, useRef, useCallback } from 'react';
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

  // ---------------------- Load Test State ----------------------
  const LOAD_TEST_TOTAL = 500;
  const [isLoadTesting, setIsLoadTesting] = useState(false);
  const [loadTestCompleted, setLoadTestCompleted] = useState(0);
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  // Existing request templates (cycled through during load test)
  const requestTemplates = useRef<Array<() => Promise<any>>>([
    () =>
      fetchTo('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Hello NetVision',
          body: 'This is a test request body',
          userId: 123,
        }),
      }),
    () =>
      fetchTo(
        'https://string.isracard.co.il/DigitalShell.MobileTestBE/GetTest',
        { method: 'GET' }
      ),
    () => fetchTo('https://sellme.app/feed', { method: 'GET' }),
    () =>
      fetchTo(
        'https://stweb.isracard.co.il/contentassets/opplqrk2/login-header-noon.png',
        { method: 'GET' }
      ),
    () =>
      fetchTo('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'GET',
      }),
  ]);

  const runLoadTest = useCallback(
    async (concurrency: number = 25) => {
      logger.info(
        `Starting load test of ${LOAD_TEST_TOTAL} requests (concurrency=${concurrency})`
      );
      setLoadTestCompleted(0);
      cancelRef.current.cancelled = false;
      setIsLoadTesting(true);
      let completed = 0;

      // Helper to launch a single request cycling through templates
      const launchRequest = (i: number) => {
        const templates = requestTemplates.current;
        if (!templates.length) {
          logger.warn('No request templates available for load test');
          return Promise.resolve();
        }
        const fn = templates[i % templates.length]!; // non-null (we just checked length)
        return fn().catch((e) => logger.warn('Load test request failed: ' + e));
      };

      const tick = async () => {
        while (completed < LOAD_TEST_TOTAL && !cancelRef.current.cancelled) {
          const remaining = LOAD_TEST_TOTAL - completed;
          const batchSize = Math.min(concurrency, remaining);
          const startIndex = completed;
          await Promise.all(
            Array.from({ length: batchSize }).map((_, idx) =>
              launchRequest(startIndex + idx).finally(() => {
                completed += 1;
                if (completed % 10 === 0 || completed === LOAD_TEST_TOTAL) {
                  setLoadTestCompleted(completed);
                }
              })
            )
          );
          // Yield to UI thread between batches
          await new Promise((r) => setTimeout(r, 10));
        }
      };

      await tick();
      if (cancelRef.current.cancelled) {
        logger.info(`Load test cancelled after ${completed} requests`);
      } else {
        logger.info('Load test finished');
        setLoadTestCompleted(completed);
      }
      setIsLoadTesting(false);
    },
    [LOAD_TEST_TOTAL]
  );

  const startLoadTest = useCallback(() => {
    if (isLoadTesting) return;
    runLoadTest();
  }, [isLoadTesting, runLoadTest]);

  const cancelLoadTest = useCallback(() => {
    if (!isLoadTesting) return;
    cancelRef.current.cancelled = true;
  }, [isLoadTesting]);

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

    fetchTo(
      'https://stweb.isracard.co.il/contentassets/opplqrk2/login-header-noon.png',
      { method: 'GET' }
    ).then(() => logger.debug('Login header image request completed'));

    fetchTo('https://jsonplaceholder.typicode.com/posts/1', {}).then(() =>
      logger.debug('GET post request completed')
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome To Net Vision!</Text>
      <Text style={styles.subtitle}>Logger Demo</Text>

      <View style={styles.buttonContainer}>
        <View style={styles.loadTestContainer}>
          <Text style={styles.loadTestTitle}>Load Test (500 requests)</Text>
          <Text testID="load-test-progress" style={styles.loadTestProgress}>
            {loadTestCompleted} / {LOAD_TEST_TOTAL}
          </Text>
          {!isLoadTesting && (
            <Button
              title="Start Load Test"
              onPress={startLoadTest}
              accessibilityLabel="Start 1000 network requests to populate logs"
              testID="start-load-test"
            />
          )}
          {isLoadTesting && (
            <Button
              title="Cancel Load Test"
              color="#cc0000"
              onPress={cancelLoadTest}
              accessibilityLabel="Cancel running load test"
              testID="cancel-load-test"
            />
          )}
        </View>
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
  loadTestContainer: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  loadTestTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadTestProgress: {
    fontSize: 14,
    color: '#333',
  },
});
