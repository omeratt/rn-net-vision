import { useEffect, useState } from 'react';
import { DevSettings, NativeModules } from 'react-native';

const { RnNetVision } = NativeModules;

// ✅ Start NetVision
export function startNetVision() {
  if (RnNetVision?.startDebuggerViaDiscovery) {
    RnNetVision.startDebuggerViaDiscovery();
  } else {
    console.warn(
      '[NetVision] Native module not found or startDebuggerViaDiscovery() not defined'
    );
  }
}

// ✅ Register Dev Menu item to start NetVision
// (only in development mode)
export function registerNetVisionDevMenu(onReadyCallback?: () => void) {
  if (__DEV__) {
    DevSettings.addMenuItem('🕵️ Start NetVision', async () => {
      console.log('[NetVision] Dev menu pressed');

      // רק אז שלח את ה-trigger למטרו
      await fetch('http://localhost:8081/net-vision-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: true }),
      }).catch((err) => {
        console.error('[NetVision] Fetch error:', err);
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));

      try {
        const result = await RnNetVision.startDebuggerViaDiscovery?.();
        console.log('[NetVision] Native responded:', result);
      } catch (e) {
        console.error('[NetVision] Native threw error:', e);
      }

      onReadyCallback?.();
    });
    // DevSettings.addMenuItem('🕵️ Start NetVision', async () => {
    //   console.log('[NetVision] Dev menu pressed');

    //   startNetVision();

    //   fetch('http://localhost:8081/net-vision-trigger', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ trigger: true }),
    //   }).catch((err) => {
    //     console.error('[NetVision] Fetch error:', err);
    //   });

    //   if (onReadyCallback) {
    //     onReadyCallback();
    //   }
    // });
  }
}

export const useNetVision = () => {
  const [isNetworkReady, setIsNetworkReady] = useState(false);
  useEffect(() => {
    registerNetVisionDevMenu(() => setIsNetworkReady(true));
  }, []);

  return isNetworkReady;
};

export const testRequest = () => {
  RnNetVision?.testRequest()
    .then((res: any) => console.log('[Native Response]', res))
    .catch(console.error);
};

// אפשר גם ייבוא דיפולטי:
export default {
  startNetVision,
  registerNetVisionDevMenu,
  useNetVision,
};
