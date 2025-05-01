import React from 'react';
import { useState } from 'react';

export default function DebuggerHeader() {
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const shutdownDebugger = async () => {
    setIsShuttingDown(true);
    try {
      const res = await fetch('http://localhost:8089/shutdown', {
        method: 'POST',
      });
      if (res.ok) {
        window.close();
        console.log('🔌 Debugger closed successfully');
      } else {
        console.warn('⚠️ Failed to shut down debugger');
      }
    } catch (err) {
      console.error('❌ Error while shutting down debugger:', err);
    } finally {
      setIsShuttingDown(false);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
      <h1 className="text-xl font-bold">NetVision Debugger</h1>
      <button
        onClick={shutdownDebugger}
        disabled={isShuttingDown}
        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl transition disabled:opacity-50"
      >
        {isShuttingDown ? 'Closing...' : 'Close Debugger ❌'}
      </button>
    </header>
  );
}
