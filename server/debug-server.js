const WebSocket = require('ws');
const http = require('http');
const net = require('net');
const { decodeResponseBody } = require('./utils/decodeBody');
const logger = require('../logger');
const { v4: uuidv4 } = require('uuid');
const { deleteLockFileContent } = require('./utils/openUrlCrossPlatform');

let shutdownTimer = null; // Track the current shutdown timer
let viteIsReady = false;
let viewerSocket = null; // Keep for backward compatibility with primary viewer

// Track connected devices and viewer sockets separately
const connectedDevices = new Map();
const viewerSockets = new Set();

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

// HTTP server for ready-check
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
    const clientIp = req.socket.remoteAddress;
    logger.info(`🔌 App connected to debugger from: ${clientIp}`);

    // Generate a device ID if not provided
    const deviceId = uuidv4().substring(0, 8);
    let deviceInfo = {
      id: deviceId,
      name: `Device-${deviceId}`,
      platform: 'unknown',
      ip: clientIp,
      connectedAt: new Date().toISOString(),
    };

    ws.on('message', async (data) => {
      const raw = data.toString();
      if (!raw.trim()) return; // 🛡 Prevent Parse Empty Data

      try {
        const json = JSON.parse(data);

        if (json.type === 'vite-ready') {
          logger.debug('🎯 Vite viewer is ready');
          viteIsReady = true;
          viewerSocket = ws;

          // Add this viewer socket to our tracking set
          viewerSockets.add(ws);

          // Send all currently connected devices to the viewer
          connectedDevices.forEach((device) => {
            ws.send(
              JSON.stringify({
                type: 'device-connected',
                deviceId: device.id,
                deviceName: device.name,
                devicePlatform: device.platform,
              })
            );
          });

          // Also send a complete devices list for better reliability
          sendDevicesList(ws);
          return;
        }

        // Handle explicit request for devices list
        if (json.type === 'get-devices') {
          logger.debug('📱 Received request for devices list');
          sendDevicesList(ws);
          return;
        }

        // Handle device registration
        if (json.type === 'device-info') {
          const { deviceId: providedId, deviceName, platform } = json;
          const id = providedId || deviceId;

          deviceInfo = {
            id,
            name: deviceName || `${platform}-${id.substring(0, 6)}`,
            platform: platform || 'unknown',
            ip: clientIp,
            connectedAt: new Date().toISOString(),
          };

          // Store device info with the connection
          connectedDevices.set(id, { ...deviceInfo, ws });

          // Notify viewers about the new device
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'device-connected',
                  deviceId: id,
                  deviceName: deviceInfo.name,
                  devicePlatform: deviceInfo.platform,
                })
              );
            }
          });

          logger.info(
            `📱 Device registered: ${deviceInfo.name} (${deviceInfo.platform})`
          );
          return;
        }

        // Process network logs
        if (json.type === 'network-log') {
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

          // Add device information to the log if it's not already there
          if (!decodedData.deviceId && deviceInfo) {
            decodedData = {
              ...decodedData,
              deviceId: deviceInfo.id,
              deviceName: deviceInfo.name,
              devicePlatform: deviceInfo.platform,
            };
          }

          logger.debug('📥 New network request:');
          logger.debug(JSON.stringify(decodedData, null, 2));

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(decodedData));
            }
          });
        }
      } catch (e) {
        logger.error(`Failed to parse message: ${e.message}`);
      }
    });

    ws.on('close', () => {
      // Check if this is a viewer socket closing
      if (viewerSockets.has(ws)) {
        // Remove from viewer sockets tracking
        viewerSockets.delete(ws);

        // If this was the current primary viewer socket, clear it
        if (ws === viewerSocket) {
          viewerSocket = null;
        }

        // Only trigger shutdown if this was the LAST viewer socket
        if (viewerSockets.size === 0) {
          logger.debug(
            '👀 Last viewer socket closed, waiting briefly to detect potential refresh...'
          );
          logger.debug(`${wss.clients.size} clients connected`);

          // Clear any existing timer to prevent race conditions
          if (shutdownTimer) {
            clearTimeout(shutdownTimer);
          }

          shutdownTimer = setTimeout(async () => {
            // Double-check that no viewer reconnected during the timeout
            if (viewerSockets.size === 0) {
              deleteLockFileContent();
              logger.debug(
                '❌ All viewer tabs really closed — shutting down debugger'
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
            }
            shutdownTimer = null;
          }, 2500); // Increased timeout to better handle multiple refreshes
        } else {
          logger.debug(
            `👀 Viewer socket closed, but ${viewerSockets.size} viewer(s) still connected`
          );
        }
      } else {
        // Find and remove the disconnected device
        for (const [id, device] of connectedDevices.entries()) {
          if (device.ws === ws) {
            connectedDevices.delete(id);

            // Notify viewers about the disconnected device
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: 'device-disconnected',
                    deviceId: id,
                  })
                );
              }
            });

            logger.info(
              `📵 Device disconnected: ${device.name} (${device.platform})`
            );
            break;
          }
        }
      }
    });
  });
};

// Function to check if viewer tab is actually open via WebSocket connection
function isViewerTabOpen() {
  return viewerSockets.size > 0;
}

// Helper function to send a complete devices list to a client
function sendDevicesList(ws) {
  const devicesList = Array.from(connectedDevices.entries()).map(
    ([id, device]) => ({
      id,
      name: device.name,
      platform: device.platform,
    })
  );

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: 'devices-list',
        devices: devicesList,
      })
    );
    logger.debug(`📱 Sent devices list with ${devicesList.length} devices`);
  }
}

// Only start the servers if this file is being executed directly
if (require.main === module) {
  createServer(READY_CHECK_PORT);
  createWebSocketServer(WS_PORT);
}

// Export functions for external use
module.exports = {
  isPortInUse,
  isViewerTabOpen,
};
