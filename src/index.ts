import { useEffect } from 'react';
import { DevSettings, NativeModules } from 'react-native';
import {
  getHostIPFromReactNative,
  isDebuggerReady,
  waitForDebuggerReady,
} from './utils';
import logger, { initializeLogger } from './logger';

const { RnNetVision } = NativeModules;

// Export the logger initialization function and logger instance
export { initializeLogger, LogLevel } from './logger';
export { default as logger } from './logger';

// ✅ Start NetVision
export async function startNetVision() {
  if (RnNetVision?.startDebugger) {
    try {
      const result = await RnNetVision.startDebugger();
      logger.info(`Native responded: ${result}`);
    } catch (e) {
      console.error('[NetVision] Native threw error:', e);
    }
  } else {
    console.warn(
      '[NetVision] Native module not found or startDebugger() not defined'
    );
  }
}

// ✅ Register Dev Menu item to start NetVision
// (only in development mode)
export function registerNetVisionDevMenu() {
  if (__DEV__) {
    // Initialize logger
    initializeLogger();
    DevSettings.addMenuItem('🕵️ Start NetVision', async () => {
      logger.info('Dev menu pressed');

      const alreadyRunning = await isDebuggerReady();

      if (alreadyRunning) {
        logger.info('Debugger already running, connecting...');
        await startNetVision(); // only connect the socket from native
        return;
      }
      // Trigger the NetVision server to start
      const host = await getHostIPFromReactNative();
      await fetch(`http://${host}:8081/net-vision-trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: true }),
      })
        .then(async () => {
          await waitForDebuggerReady();

          await startNetVision();
        })
        .catch(() => {
          console.warn(
            '[NetVision] cannot start NetVision server, try again...'
          );
        });
    });
  }
}

/**
 * Hook that starts NetVision connection if debugger is alive.
 */
export function useNetVision() {
  useEffect(() => {
    (async () => {
      registerNetVisionDevMenu();

      RnNetVision?.activateSslPinningInterceptor();

      const ready = await isDebuggerReady();
      if (ready) {
        logger.info('Debugger detected immediately (on app start)!');

        await startNetVision();
      }
    })();
  }, []);
}

export const testRequest = () => {
  RnNetVision?.testRequest()
    .then((res: any) => logger.info(`Native Response: ${res}`))
    .catch((err: Error) => logger.error(`Test request error: ${err.message}`));
};

export default {
  startNetVision,
  registerNetVisionDevMenu,
  useNetVision,
};
