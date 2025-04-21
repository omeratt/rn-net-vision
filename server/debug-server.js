const dgram = require('dgram');
const WebSocket = require('ws');

const UDP_PORT = 4242;
const WS_PORT = 8088;

// UDP Broadcast - for discovery
const udpServer = dgram.createSocket('udp4');

// This server will broadcast a discovery packet every 2 seconds
setInterval(() => {
  const message = Buffer.from(`NETVISION_DISCOVERY:${WS_PORT}`);
  udpServer.send(message, 0, message.length, UDP_PORT, '255.255.255.255');
  console.log('📡 Broadcasting discovery packet...');
}, 2000);

// 👇 ענה לכל מי ששולח בקשת discovery
udpServer.on('message', (msg, rinfo) => {
  console.log(
    `📩 Got UDP discovery request from ${rinfo.address}:${rinfo.port}`
  );

  const response = Buffer.from(`NETVISION_DISCOVERY:${WS_PORT}`);
  udpServer.send(response, 0, response.length, rinfo.port, rinfo.address);
  console.log(`📨 Sent discovery response to ${rinfo.address}:${rinfo.port}`);
});

udpServer.bind(UDP_PORT, () => {
  udpServer.setBroadcast(true);
});

// WebSocket Server - for receiving network requests
const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`🚀 WebSocket server listening on ws://localhost:${WS_PORT}`);
});

wss.on('connection', (ws, req) => {
  console.log('🔌 App connected to debugger from:', req.socket.remoteAddress);

  ws.on('message', (data) => {
    try {
      const json = JSON.parse(data);
      console.log('📥 New network request:');
      console.log(JSON.stringify(json, null, 2));

      // ✅ שלח לכולם, כולל viewer
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(json));
        }
      });
    } catch (e) {
      console.log('⚠️ Failed to parse message:', data);
    }
  });

  ws.send(JSON.stringify({ info: '👋 Viewer connected!' }));

  ws.on('close', () => {
    console.log('❌ App disconnected');
  });
});
