const WebSocket = require('ws');
const http = require('http');
const net = require('net');
const { decodeResponseBody } = require('./utils/decodeBody');
const logger = require('../logger');

let shutdownTimer = null; // Track the current shutdown timer

let viteIsReady = false;
let viewerSocket = null;

// Port for the WebSocket server
const WS_PORT = 8088;
// Port for the ready-check server and shutdown server
const READY_CHECK_PORT = 3232;

// Function to check if port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once('error', () => {
        // Port is in use
        resolve(true);
      })
      .once('listening', () => {
        // Port is free
        server.close();
        resolve(false);
      })
      .once('error', () => {
        // Port is in use
        resolve(true);
      })
      .listen(port);
  });
}

function shutdownDebugger() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        method: 'POST',
        host: '127.0.0.1',
        port: 8089,
        path: '/shutdown',
      },
      (res) => {
        logger.info(`Shutdown response: ${res.statusCode}`);
        resolve();
      }
    );

    req.on('error', (err) => {
      logger.error('Failed to shutdown debugger:', err.message);
      resolve();
    });

    req.end();
  });
}

// HTTP server קטן ל־ready-check
const createServer = async (port) => {
  const isPortUsed = await isPortInUse(port);
  if (isPortUsed) {
    logger.warn(
      `Port ${port} is already in use. Unable to start ready-check server.`
    );
    return;
  }

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
    .listen(port, '0.0.0.0', () => {
      logger.debug(`🛰 Ready-check server listening on http://0.0.0.0:${port}`);
    });
};
createServer(READY_CHECK_PORT);

// WebSocket Server - for receiving network requests
const createWebSocketServer = async (port) => {
  const isPortUsed = await isPortInUse(port);
  if (isPortUsed) {
    logger.warn(
      `Port ${port} is already in use. Unable to start WebSocket server.`
    );
    return;
  }
  const wss = new WebSocket.Server({ port: WS_PORT }, () => {
    logger.info(`🚀 WebSocket server listening on ws://localhost:${WS_PORT}`);
  });

  wss.on('connection', (ws, req) => {
    logger.info(
      `🔌 App connected to debugger from: ${req.socket.remoteAddress}`
    );

    ws.on('message', async (data) => {
      const raw = data.toString();
      if (!raw.trim()) return; // 🛡 Prevent Parse Empty Data

      try {
        const json = JSON.parse(data);

        if (json.type === 'vite-ready') {
          logger.debug('🎯 Vite viewer is ready');
          viteIsReady = true;
          viewerSocket = ws;
          return;
        }
        const rawBody = json.responseBody ?? '';
        const headers = json.responseHeaders ?? {};
        const decodedBody = await decodeResponseBody(
          headers['content-encoding'],
          rawBody
        );

        let decodedData = { ...json };
        if (decodedBody) {
          try {
            decodedData.responseBody = JSON.parse(decodedBody);
          } catch (e) {
            decodedData.responseBody = decodedBody;
          }
        }

        logger.debug('📥 New network request:');

        logger.debug(JSON.stringify(decodedData, null, 2));

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(decodedData));
          }
        });
      } catch (e) {
        logger.error(`Failed to parse message: ${e.message}`);
      }
    });

    ws.on('close', () => {
      if (ws === viewerSocket) {
        viewerSocket = null;
        logger.debug(
          '👀 Viewer socket closed, waiting briefly to detect potential refresh...'
        );

        // Clear any existing timer to prevent race conditions
        if (shutdownTimer) {
          clearTimeout(shutdownTimer);
        }

        shutdownTimer = setTimeout(async () => {
          if (!viewerSocket) {
            logger.debug(
              '❌ Viewer tab really closed — shutting down debugger'
            );
            try {
              // Only try to shut down if we need to, but don't fail if it doesn't work
              await shutdownDebugger().catch((err) => {
                logger.error(
                  `Shutdown service not available, continuing with exit: ${err.message}`
                );
              });
            } finally {
              process.exit();
            }
          } else {
            logger.debug(
              '🔄 Viewer reconnected (probably a refresh), keeping debugger alive'
            );
            // ws.send(JSON.stringify({ type: 'vite-reconnect' }));
          }
          shutdownTimer = null;
        }, 2500); // Increased timeout to better handle multiple refreshes
      } else {
        console.info('[NetVision] App disconnected from debugger 📵');
      }
    });
  });
};

createWebSocketServer(WS_PORT);

module.exports = {
  isPortInUse,
};
