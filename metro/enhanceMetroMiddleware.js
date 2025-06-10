// enhanceMetroMiddleware.js

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http'); // ✅ נוסף
const { startTrackingDevices } = require('./trackAdbDevices.cjs');
const openUrlCrossPlatform = require('../server/utils/openUrlCrossPlatform');
const logger = require('../logger');

const isBundling = process.argv.includes('bundle');

let enhanceMetroMiddleware;

let didStartAdbTracking = false;

async function isDebuggerRunning() {
  return new Promise((resolve) => {
    http
      .get('http://127.0.0.1:8089/ready-check', (res) => {
        resolve(res.statusCode === 200);
      })
      .on('error', () => resolve(false));
  });
}
if (isBundling) {
  logger.info('💤 Skipping middleware during bundling');
  enhanceMetroMiddleware = () => (middleware) => middleware;
} else {
  enhanceMetroMiddleware = function _enhanceMetroMiddleware({ projectRoot }) {
    logger.info('Middleware activated');

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
    } catch (e) {
      logger.info(
        `No config file found, using default (dev mode) - ${e.message}`
      );
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
            console.log('👀 [NetVision] start watching...');
            const alreadyRunning = await isDebuggerRunning();

            if (!alreadyRunning) {
              serverProcesses = spawn('node', [absDebuggerPath], {
                cwd: projectRoot,
                stdio: isProduction === 'true' ? 'ignore' : 'inherit',
                env: {
                  ...process.env,
                  NET_VISION_PRODUCTION: isProduction,
                },
              });
            } else {
              logger.info('Debugger already running');
              openUrlCrossPlatform('http://localhost:5173');
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
}

module.exports = enhanceMetroMiddleware;
