import { useEffect } from 'react';
import { DevSettings, NativeModules } from 'react-native';
import {
  getHostIPFromReactNative,
  isDebuggerReady,
  waitForDebuggerReady,
} from './utils';

const { RnNetVision } = NativeModules;

// ✅ Start NetVision
export async function startNetVision() {
  if (RnNetVision?.startDebugger) {
    try {
      const result = await RnNetVision.startDebugger();
      console.log('[NetVision] Native responded:', result);
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
    DevSettings.addMenuItem('🕵️ Start NetVision', async () => {
      console.log('[NetVision] Dev menu pressed');

      const alreadyRunning = await isDebuggerReady();

      if (alreadyRunning) {
        console.log('[NetVision] Debugger already running, connecting...');
        await startNetVision(); // רק לעשות connect
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
        .catch((err) => {
          console.error('[NetVision] Fetch error:', err);
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

      const ready = await isDebuggerReady();
      if (ready) {
        console.log(
          '[NetVision] Debugger detected immediately (on app start)!'
        );

        await startNetVision();
      }
    })();
  }, []);
}

export const testRequest = () => {
  RnNetVision?.testRequest()
    .then((res: any) => console.log('[Native Response]', res))
    .catch(console.error);
};

export default {
  startNetVision,
  registerNetVisionDevMenu,
  useNetVision,
};
