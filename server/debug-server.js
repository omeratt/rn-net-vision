const WebSocket = require('ws');

const http = require('http');

let viteIsReady = false;
let viewerSocket = null;

function shutdownDebugger() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        method: 'POST',
        host: 'localhost',
        port: 8089,
        path: '/shutdown',
      },
      (res) => {
        console.log(`[NetVision] Shutdown response: ${res.statusCode}`);
        resolve();
      }
    );

    req.on('error', (err) => {
      console.error('[NetVision] Failed to shutdown debugger:', err.message);
      resolve();
    });

    req.end();
  });
}

// HTTP server קטן ל־ready-check
http
  .createServer((req, res) => {
    if (req.url === '/ready-check') {
      if (viteIsReady) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ready');
      } else {
        res.writeHead(503);
        res.end('not ready');
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(3232, '0.0.0.0', () => {
    console.log(
      '[NetVision] 🛰 Ready-check server listening on http://0.0.0.0:3232'
    );
  });

const WS_PORT = 8088;

// WebSocket Server - for receiving network requests
const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`🚀 WebSocket server listening on ws://localhost:${WS_PORT}`);
});

wss.on('connection', (ws, req) => {
  console.log('🔌 App connected to debugger from:', req.socket.remoteAddress);

  ws.on('message', (data) => {
    try {
      const json = JSON.parse(data);

      if (json.type === 'vite-ready') {
        console.log('[NetVision] 🎯 Vite viewer is ready');
        viteIsReady = true;
        viewerSocket = ws;
        return;
      }

      console.log('📥 New network request:');
      console.log(JSON.stringify(json, null, 2));

      // ✅ שלח לכולם, כולל viewer
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(json));
        }
      });
    } catch (e) {
      console.log('⚠️ Failed to parse message:', e, data);
    }
  });

  ws.on('close', () => {
    if (ws === viewerSocket) {
      viewerSocket = null;
      console.log(
        '👀 Viewer socket closed, waiting briefly to detect potential refresh...'
      );

      setTimeout(async () => {
        if (!viewerSocket) {
          console.log('❌ Viewer tab really closed — shutting down debugger');
          await shutdownDebugger();
          process.exit();
        } else {
          console.log(
            '🔄 Viewer reconnected (probably a refresh), keeping debugger alive'
          );
        }
      }, 1000);
    } else {
      console.log('❌ App disconnected');
    }
  });
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received, cleaning up...');

  try {
    await shutdownDebugger();
    wss.close();
  } catch (e) {
    console.error('❌ Error during shutdown:', e);
  }

  process.exit();
});

process.on('exit', () => {
  console.log('👋 Exiting, cleaning up...');
  wss.close();
});
