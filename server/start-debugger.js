#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const openUrlCrossPlatform = require('./utils/openUrlCrossPlatform');

// Parse CLI flag
const isProduction = process.env.NET_VISION_PRODUCTION === 'true';

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/ready-check') {
      res.writeHead(200);
      res.end('debugger-ready');
      return;
    }

    if (req.url === '/shutdown') {
      console.log('👋 Shutdown request received via viewer');

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
    console.log('🛰 Listening for shutdown requests on 0.0.0.0:8089');
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
  viteCommand = 'node';
  viteArgs = [path.join(viewerPath, 'run-vite-production.js')];
} else {
  viteCommand = isWindows ? 'npm.cmd' : 'npm';
  viteArgs = ['run', 'dev'];
}

const vite = spawn(viteCommand, viteArgs, {
  cwd: viewerPath,
  stdio: 'inherit',
});

// Open the viewer in browser after short delay
setTimeout(() => {
  openUrlCrossPlatform('http://localhost:5173');
}, 2000);

let hasShutdown = false;

function gracefulExit() {
  if (hasShutdown) return;
  hasShutdown = true;

  console.log('\n👋 Shutting down NetVision Debugger...');
  server.kill('SIGINT');
  vite.kill('SIGINT');
  process.exit();
}

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);
