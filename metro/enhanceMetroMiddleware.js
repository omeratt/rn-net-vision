// enhanceMetroMiddleware.js

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http'); // ✅ נוסף
const { startTrackingDevices } = require('./trackAdbDevices.cjs');

let didStartAdbTracking = false;

async function isDebuggerRunning() {
  return new Promise((resolve) => {
    http
      .get('http://localhost:8089/ready-check', (res) => {
        resolve(res.statusCode === 200);
      })
      .on('error', () => resolve(false));
  });
}

module.exports = function enhanceMetroMiddleware({ projectRoot }) {
  console.log('[NetVision] Middleware activated');

  if (!didStartAdbTracking) {
    didStartAdbTracking = true;
    try {
      startTrackingDevices();
    } catch (e) {
      console.error('[NetVision] Failed to start ADB tracking:', e);
    }
  }

  let absDebuggerPath = path.join(
    projectRoot,
    'node_modules',
    '@omeratt',
    'rn-net-vision',
    'server',
    'start-debugger.js'
  );

  if (!fs.existsSync(absDebuggerPath)) {
    // fallback – מצב פיתוח
    absDebuggerPath = path.join(
      projectRoot,
      '..',
      'server',
      'start-debugger.js'
    );
  }

  let isProduction = 'false';

  let serverProcesses = null;

  try {
    // Check if the config file exists in the project root - Production mode
    let rootConfigPath = path.join(projectRoot, 'netvision.config.js');

    // If File not found on Production mode, check if it's in the package
    if (!fs.existsSync(rootConfigPath)) {
      rootConfigPath = path.join(
        projectRoot,
        'node_modules',
        '@omeratt',
        'rn-net-vision',
        'netvision.config.js'
      );
    }

    // Fallback to Dev Mode - If File not found on Production mode, check if it's in the package
    if (!fs.existsSync(rootConfigPath)) {
      rootConfigPath = path.join(projectRoot, '..', 'netvision.config.js');
    }
    const config = require(rootConfigPath);

    isProduction = config.isProduction ?? 'true';
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    console.log('[NetVision] No config file found, using default (dev mode)');
  }

  process.on('exit', () => {
    if (serverProcesses) {
      serverProcesses.kill('SIGINT');
    }
  });

  return function middlewareWrapper(middleware) {
    return async (req, res, next) => {
      if (req.url === '/net-vision-trigger' && req.method === 'POST') {
        try {
          const alreadyRunning = await isDebuggerRunning();

          if (!alreadyRunning) {
            serverProcesses = spawn('node', [absDebuggerPath], {
              cwd: projectRoot,
              stdio: 'inherit',
              env: {
                ...process.env,
                NET_VISION_PRODUCTION: isProduction,
              },
            });
          } else {
            console.log('[NetVision] Debugger already running');
            res.writeHead(204);
            res.end();
            return;
          }

          res.writeHead(200);
          res.end('NetVision launched');
        } catch (err) {
          console.error('[NetVision] Failed to launch:', err);
          res.writeHead(500);
          res.end('NetVision failed');
        }
      } else {
        return middleware(req, res, next);
      }
    };
  };
};
