#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');

// Parse CLI flag
const isProduction = process.env.NET_VISION_PRODUCTION === 'true';

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/ready-check') {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': '14',
      });
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

    res.writeHead(404, {
      'Content-Type': 'text/plain',
      'Content-Length': '9',
    });
    res.end('Not found');
  })
  .listen(8089, '0.0.0.0', () => {
    console.log('🛰 Listening for shutdown requests on 0.0.0.0:8089');
  });

// Paths
const serverPath = path.join(__dirname, 'debug-server.js');
const viewerPath = path.join(__dirname, '../web-viewer');

// Utility: Open URL in default browser (Cross-Platform)
function openUrlCrossPlatform(url) {
  const platform = process.platform;

  let command;
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.error('❌ Failed to open browser:', err);
    }
  });
}

// Start WebSocket server
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
});

// Start Vite dev server
const isWindows = process.platform === 'win32';
const viteCommand = isWindows ? 'npm.cmd' : 'npm';
const viteArgs = isProduction ? ['run', 'production'] : ['run', 'dev'];

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
