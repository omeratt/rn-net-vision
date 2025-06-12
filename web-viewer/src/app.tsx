/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useWebSocket } from './hooks/useWebSocket';
import { useTheme } from './hooks/useTheme';
import { NetworkLogs } from './components/organisms/NetworkLogs';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';
import { DeviceProvider } from './context/DeviceContext';
import { DeviceDebugPanel } from './components/atoms/DeviceDebugPanel';
import { Header } from './components/organisms/Header';

// Inner component that uses the DeviceContext
function AppContent(): VNode {
  const { logs, clearLogs, isConnected } = useWebSocket();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <Header
        isConnected={isConnected}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="w-full flex-1 flex flex-col px-4 py-3 sm:px-6 md:px-8">
        <NetworkLogs logs={logs} onClear={clearLogs} />
      </main>

      {/* Temporary debug panel to diagnose device state issue */}
      <DeviceDebugPanel />
    </div>
  );
}

export default function App(): VNode {
  return (
    <ErrorBoundary>
      <DeviceProvider>
        <AppContent />
      </DeviceProvider>
    </ErrorBoundary>
  );
}
