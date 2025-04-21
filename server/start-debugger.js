#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');

const http = require('http');

http
  .createServer((req, res) => {
    if (req.url === '/shutdown') {
      console.log('👋 Shutdown request received via viewer');

      server?.kill?.('SIGINT');
      vite?.kill?.('SIGINT');
      res.end('Shutting down...');
      process.exit();
    } else {
      res.end('NetVision debugger active');
    }
  })
  .listen(8089, () => {
    console.log('🛰 Listening for shutdown requests on http://localhost:8089');
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

const vite = spawn(viteCommand, ['run', 'dev'], {
  cwd: viewerPath,
  stdio: 'inherit',
});

// Open the viewer in browser after short delay
setTimeout(() => {
  openUrlCrossPlatform('http://localhost:5173');
}, 2000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down NetVision Debugger...');
  server.kill('SIGINT');
  vite.kill('SIGINT');
  process.exit();
});
