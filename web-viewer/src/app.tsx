/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useWebSocket } from './hooks/useWebSocket';
import { useTheme } from './hooks/useTheme';
import { NetworkLogs } from './components/organisms/NetworkLogs';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';
import { DeviceProvider } from './context/DeviceContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/organisms/Header';

// Inner component that uses the DeviceContext
function AppContent(): VNode {
  const { logs, clearLogs, isConnected } = useWebSocket();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 text-gray-900 dark:text-gray-100 transition-all duration-500">
      {/* Enhanced background pattern matching header */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50/80 via-blue-50/40 to-indigo-50/60 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-indigo-900/40 pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none -z-10" />

      <Header
        isConnected={isConnected}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="relative w-full flex-1 flex flex-col px-4 py-6 sm:px-6 md:px-8">
        <NetworkLogs logs={logs} onClear={clearLogs} />
      </main>
    </div>
  );
}

export default function App(): VNode {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DeviceProvider>
          <AppContent />
        </DeviceProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
