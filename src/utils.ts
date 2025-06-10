import { NativeModules, Platform } from 'react-native';
import logger from './logger';

export async function getHostIPFromReactNative(): Promise<string> {
  if (Platform.OS === 'ios') {
    try {
      const ip = await NativeModules?.RnNetVision?.getHostIPAddress?.();
      return ip;
    } catch (err) {
      console.warn('[NetVision] Failed to get host IP, fallback to localhost');
      return 'localhost';
    }
  }

  return 'localhost';
}

/**
 * Internal function to check if debugger is ready.
 */
async function fetchDebuggerReady(): Promise<boolean> {
  try {
    const host = await getHostIPFromReactNative();
    const res = await fetch(`http://${host}:3232/ready-check`, {
      method: 'GET',
    });
    return res.ok;
  } catch (err) {
    console.log(
      '[NetVision] Debugger not ready:',
      JSON.stringify(err, null, 2)
    );
    return false;
  }
}

/**
 * Public API to check if debugger is ready.
 */
export async function isDebuggerReady(): Promise<boolean> {
  return await fetchDebuggerReady();
}

/**
 * Public API to wait for debugger to become ready (polling).
 */
export function waitForDebuggerReady(
  maxAttempts = 50,
  delayMs = 300
): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const interval = setInterval(async () => {
      logger.debug('Checking if debugger is ready...(1)');
      const ready = await fetchDebuggerReady();

      logger.debug('Checking if debugger is ready...(2)');

      if (ready) {
        clearInterval(interval);
        logger.info('Debugger is ready!');
        resolve();
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('Timeout waiting for debugger to become ready'));
        }
      }
    }, delayMs);
  });
}
