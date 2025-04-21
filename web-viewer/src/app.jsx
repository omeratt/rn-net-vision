import './app.css';
import { useEffect, useState } from 'preact/hooks';

export function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const shutdown = () => {
      navigator.sendBeacon?.(
        'http://localhost:8089/shutdown',
        JSON.stringify({ reason: 'window closed' })
      );
    };

    window.addEventListener('beforeunload', shutdown);

    return () => {
      window.removeEventListener('beforeunload', shutdown);
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8088');
    ws.onopen = () => {
      console.log('👋 Connected to NetVision WebSocket');
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error', err);
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => [data, ...prev]);
      } catch (e) {
        console.error('Failed to parse message:', event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div class="min-h-screen bg-white p-4 space-y-4 font-mono">
      <h1 class="text-xl font-bold text-gray-800">📡 NetVision Viewer</h1>
      <ul class="space-y-2">
        {logs.map((log, i) => (
          <li key={i} class="bg-gray-100 p-4 rounded shadow text-sm">
            <pre>{JSON.stringify(log, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
