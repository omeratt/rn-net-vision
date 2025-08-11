/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useRef, useCallback } from 'preact/hooks';
import { useWebSocket } from './hooks/useWebSocket';
import { useTheme } from './hooks/useTheme';
import { useUnifiedLogFilters } from './hooks/useUnifiedLogFilters';
import { useLogHighlight, useAppGlobalSearch } from './hooks';
import { NetworkLogs } from './components/organisms/NetworkLogs';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';
import { DeviceProvider, useDevices } from './context/DeviceContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/organisms/Header';

// Inner component that uses the DeviceContext
function AppContent(): VNode {
  const { logs, clearLogs, isConnected } = useWebSocket();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { activeDeviceId } = useDevices();

  // Use unified filtering that includes ALL filter types (device, URL, method, status)
  const unifiedFilters = useUnifiedLogFilters(logs, activeDeviceId);

  // Ref to access the log container for focus restoration after search closes
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Log highlighting hook for search selection feedback
  const logHighlight = useLogHighlight();

  // Global search integration hook
  const globalSearch = useAppGlobalSearch({
    onHighlight: logHighlight.setHighlight,
  });

  // Handler to restore focus to log container after search closes
  const handleSearchClose = useCallback(() => {
    if (logContainerRef.current) {
      logContainerRef.current.focus();
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-slate-100/40 via-blue-50/30 to-gray-100/50 dark:from-gray-800/95 dark:via-gray-800/60 dark:to-gray-800/95 text-gray-900 dark:text-gray-100 transition-all duration-500 overflow-hidden">
      {/* Professional light foundation - cool neutral tones */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50/60 via-blue-50/30 to-gray-50/70 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 pointer-events-none -z-10" />
      {/* Subtle professional accent flow */}
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-200/8 via-slate-200/6 to-gray-200/10 dark:from-gray-800/80 dark:via-indigo-600/20 dark:to-purple-600/25 pointer-events-none -z-10" />
      {/* Counter-diagonal - cool professional tones */}
      <div className="fixed inset-0 bg-gradient-to-bl from-transparent via-transparent to-transparent dark:from-gray-800/60 dark:via-indigo-700/35 dark:to-rose-600/20 pointer-events-none -z-10" />
      {/* Central glow - subtle and professional */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-blue-50/15 to-slate-100/20 dark:from-gray-800/50 dark:via-gray-800/10 dark:to-transparent pointer-events-none -z-10" />
      {/* Top accent - clean and modern */}
      <div className="fixed inset-0 bg-gradient-to-t from-transparent via-slate-100/10 to-blue-100/15 dark:from-gray-800/40 dark:via-gray-800/60 dark:to-pink-700/15 pointer-events-none -z-10" />
      {/* Final professional layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-transparent via-gray-100/8 to-slate-200/12 dark:from-gray-800/50 dark:via-indigo-900/15 dark:to-purple-900/20 pointer-events-none -z-10" />

      <Header
        isConnected={isConnected}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        logs={unifiedFilters.filteredLogs}
        onLogSelect={globalSearch.handleLogSelect}
        onScrollToLog={globalSearch.handleScrollToLog}
        onSearchClose={handleSearchClose}
      />

      <main className="relative w-full flex-1 flex flex-col h-full px-4 pb-4 pt-4 sm:px-6 md:px-6 min-h-0">
        <div className="flex-1 h-full min-h-0 border-2 border-gray-200/30 dark:border-slate-700/30 rounded-lg shadow-lg overflow-hidden relative">
          <NetworkLogs
            logs={unifiedFilters.filteredLogs}
            filters={unifiedFilters}
            onClear={clearLogs}
            logContainerRef={logContainerRef}
            highlightedLogId={logHighlight.highlightedLogId}
            highlightState={logHighlight.highlightState}
            onLogSelectionChange={globalSearch.registerNetworkLogsMethods}
          />
        </div>
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
