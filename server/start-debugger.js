#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const openUrlCrossPlatform = require('./utils/openUrlCrossPlatform');
const logger = require('../logger');

// Parse CLI flag
const isProduction = process.env.NET_VISION_PRODUCTION === 'true';

// Function to check if Vite viewer is already open
function isViewerAlreadyOpen() {
  return new Promise((resolve) => {
    // First check the ready-check server
    const readyCheckReq = http.request(
      {
        method: 'GET',
        host: 'localhost',
        port: 3232,
        path: '/ready-check',
        timeout: 1000,
      },
      (res) => {
        if (res.statusCode === 200) {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(data === 'ready');
          });
        } else {
          // If not ready, check if Vite is running directly
          checkViteRunning();
        }
      }
    );

    readyCheckReq.on('error', () => {
      // If the ready-check server isn't available, check if Vite is running directly
      checkViteRunning();
    });

    readyCheckReq.end();

    // Helper function to check if Vite is running directly
    function checkViteRunning() {
      const viteReq = http.request(
        {
          method: 'GET',
          host: 'localhost',
          port: 5173, // Vite's default port
          path: '/',
          timeout: 1000,
        },
        (res) => {
          // If Vite responds with any status code, it's running
          resolve(res.statusCode >= 200);
        }
      );

      viteReq.on('error', () => {
        // If Vite isn't running either, resolve to false
        resolve(false);
      });

      viteReq.end();
    }
  });
}

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/ready-check') {
      res.writeHead(200);
      res.end('debugger-ready');
      return;
    }

    if (req.url === '/shutdown') {
      logger.info('👋 Shutdown request received via viewer');

      let didExit = false;
      const exitOnce = () => {
        if (!didExit) {
          didExit = true;
          process.exit();
        }
      };

      server?.kill?.('SIGINT');
      vite?.kill?.('SIGINT');

      setTimeout(exitOnce, 1000); // minimal delay to allow for graceful shutdown
      res.end('Shutting down...');
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  })
  .listen(8089, '0.0.0.0', () => {
    logger.info('🛰 Listening for shutdown requests on 0.0.0.0:8089');
  });

// Paths
const serverPath = path.join(__dirname, 'debug-server.js');
const viewerPath = path.join(__dirname, '../web-viewer');

// Start WebSocket server
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
});

// Start Vite dev server
const isWindows = process.platform === 'win32';

let viteCommand, viteArgs;
if (isProduction) {
  // Use the absolute path to the current Node.js executable
  viteCommand = process.execPath;
  // Run as ES module since web-viewer/package.json has "type": "module"
  viteArgs = [
    '--experimental-modules',
    path.join(viewerPath, 'run-vite-production.js'),
  ];
} else {
  viteCommand = isWindows ? 'npm.cmd' : 'npm';
  viteArgs = ['run', 'dev'];
}

const vite = spawn(viteCommand, viteArgs, {
  cwd: viewerPath,
  stdio: 'inherit',
});

// Open the viewer in browser after short delay, but only if not already open
setTimeout(async () => {
  logger.info('🔍 Checking if NetVision viewer is already open...');
  const viewerAlreadyOpen = await isViewerAlreadyOpen();

  if (!viewerAlreadyOpen) {
    logger.info('🔗 Opening NetVision viewer in browser...');
    openUrlCrossPlatform('http://localhost:5173');
  } else {
    logger.info('✅ NetVision viewer already open, reusing existing tab');
  }
}, 2000);

let hasShutdown = false;

function gracefulExit() {
  if (hasShutdown) return;
  hasShutdown = true;

  logger.info('\n👋 Shutting down NetVision Debugger...');
  server.kill('SIGINT');
  vite.kill('SIGINT');
  process.exit();
}

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);
