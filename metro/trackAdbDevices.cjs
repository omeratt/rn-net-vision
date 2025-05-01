// metro/trackAdbDevices.js
const { spawn } = require('child_process');

const PORTS = [3232, 8088, 8089];

function reversePorts() {
  for (const port of PORTS) {
    const cmd = spawn('adb', ['reverse', `tcp:${port}`, `tcp:${port}`]);

    cmd.on('exit', (code) => {
      if (code === 0) {
        console.log(`[NetVision] ✅ ADB reverse successful for port ${port}`);
      } else {
        console.warn(
          `[NetVision] ⚠️ ADB reverse failed for port ${port} (code ${code})`
        );
      }
    });
  }
}

function startTrackingDevices() {
  const tracker = spawn('adb', ['track-devices']);
  console.log('[NetVision] 🛰 Listening for ADB device changes...');

  tracker.stdout.on('data', (data) => {
    const output = data.toString().trim();
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('device')) {
        console.log('[NetVision] 📱 ADB device detected');
        reversePorts();
      }
    }
  });

  tracker.stderr.on('data', (data) => {
    console.error('[NetVision] 🔥 ADB tracker error:', data.toString());
  });

  tracker.on('close', (code) => {
    console.warn(
      `[NetVision] ⚠️ ADB tracking exited (code ${code}) — restarting in 2s...`
    );
    setTimeout(startTrackingDevices, 2000);
  });
}

module.exports = {
  startTrackingDevices,
};
