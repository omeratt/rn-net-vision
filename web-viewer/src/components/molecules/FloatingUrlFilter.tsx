/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useUrlFilter } from '../../context/UrlFilterContext';
import { ScrollFadeContainer } from '../atoms';
import { FilterIcon } from '../icons';

interface FloatingUrlFilterProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: any;
}

export const FloatingUrlFilter = ({
  isOpen,
  onClose,
  anchorRef,
}: FloatingUrlFilterProps): VNode | null => {
  const {
    whitelist,
    blacklist,
    isWhitelistEnabled,
    isBlacklistEnabled,
    addToWhitelist,
    removeFromWhitelist,
    toggleWhitelistRule,
    toggleWhitelistEnabled,
    addToBlacklist,
    removeFromBlacklist,
    toggleBlacklistRule,
    toggleBlacklistEnabled,
    clearAllFilters,
    getActiveFiltersCount,
  } = useUrlFilter();

  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [activeTab, setActiveTab] = useState<'whitelist' | 'blacklist'>(
    'whitelist'
  );
  const [newPattern, setNewPattern] = useState('');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      setShouldRender(true);
      const anchor = anchorRef.current.getBoundingClientRect();
      const viewport = { width: window.innerWidth, height: window.innerHeight };

      let top = anchor.bottom + 8;
      let left = anchor.left;

      if (left + 420 > viewport.width) {
        left = anchor.right - 420;
      }

      const estimatedPanelHeight = 500;
      if (top + estimatedPanelHeight > viewport.height) {
        top = anchor.top - estimatedPanelHeight - 8;
      }

      setPosition({ top, left });
      setTimeout(() => setIsAnimating(true), 50);
    } else if (!isOpen && shouldRender) {
      setIsAnimating(false);
      setTimeout(() => {
        setShouldRender(false);
        setPosition(null);
        setNewPattern('');
      }, 300);
    }
  }, [isOpen, anchorRef, shouldRender]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  const handleAddPattern = () => {
    if (!newPattern.trim()) return;
    if (activeTab === 'whitelist') {
      addToWhitelist(newPattern);
    } else {
      addToBlacklist(newPattern);
    }
    setNewPattern('');
  };

  const handleTabChange = (newTab: 'whitelist' | 'blacklist') => {
    if (newTab === activeTab) return;
    setIsTabTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setTimeout(() => setIsTabTransitioning(false), 20);
    }, 100);
  };

  if (!shouldRender || !position) {
    return null;
  }

  const activeFiltersCount = getActiveFiltersCount();
  const currentList = activeTab === 'whitelist' ? whitelist : blacklist;
  const isCurrentEnabled =
    activeTab === 'whitelist' ? isWhitelistEnabled : isBlacklistEnabled;

  const portalContent = (
    <>
      <div
        className={`fixed inset-0 bg-black/20 dark:bg-black/30 z-50 transition-all duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        } backdrop-blur-sm`}
      />

      <div
        ref={panelRef}
        className={`fixed w-[420px] bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 transition-all duration-300 ease-out ${
          isAnimating
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-2 scale-98'
        }`}
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              {/* filter header icon */}
              <FilterIcon size="sm" className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                URL Filter Manager
              </h3>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {activeFiltersCount} active filter
                  {activeFiltersCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearAllFilters}
              className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-600 dark:text-red-400"
              title="Clear all filters"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-600 relative">
          <button
            onClick={() => handleTabChange('whitelist')}
            className={`flex-1 px-4 py-3 text-sm font-medium relative transition-all duration-300 ease-out ${
              activeTab === 'whitelist'
                ? 'text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span>Whitelist</span>
              {whitelist.filter((rule) => rule.isActive).length > 0 && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-1.5 py-0.5 rounded-full">
                  {whitelist.filter((rule) => rule.isActive).length}
                </span>
              )}
            </div>
            {/* Active tab indicator */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transition-all duration-300 ease-out ${
                activeTab === 'whitelist'
                  ? 'opacity-100 scale-x-100'
                  : 'opacity-0 scale-x-0'
              }`}
            />
          </button>
          <button
            onClick={() => handleTabChange('blacklist')}
            className={`flex-1 px-4 py-3 text-sm font-medium relative transition-all duration-300 ease-out ${
              activeTab === 'blacklist'
                ? 'text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m4.9 4.9 14.2 14.2" />
              </svg>
              <span>Blacklist</span>
              {blacklist.filter((rule) => rule.isActive).length > 0 && (
                <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-1.5 py-0.5 rounded-full">
                  {blacklist.filter((rule) => rule.isActive).length}
                </span>
              )}
            </div>
            {/* Active tab indicator */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 transition-all duration-300 ease-out ${
                activeTab === 'blacklist'
                  ? 'opacity-100 scale-x-100'
                  : 'opacity-0 scale-x-0'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <ScrollFadeContainer
          className="p-4 space-y-4 max-h-80 overflow-y-auto refined-scrollbar"
          fadeHeight={60}
        >
          <div
            className={`transition-all duration-300 ease-out space-y-4 ${
              isTabTransitioning
                ? 'opacity-0 scale-95'
                : 'opacity-100 scale-100'
            }`}
          >
            {/* Toggle Enable/Disable */}
            <div
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                isCurrentEnabled
                  ? activeTab === 'whitelist'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activeTab === 'whitelist' ? 'Whitelist' : 'Blacklist'} Filter
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activeTab === 'whitelist'
                    ? 'Only show URLs matching these patterns'
                    : 'Hide URLs matching these patterns'}
                </p>
              </div>
              <button
                onClick={() => {
                  if (activeTab === 'whitelist') {
                    toggleWhitelistEnabled();
                  } else {
                    toggleBlacklistEnabled();
                  }
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isCurrentEnabled
                    ? activeTab === 'whitelist'
                      ? 'bg-green-600 focus:ring-green-500'
                      : 'bg-red-600 focus:ring-red-500'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isCurrentEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Add New Pattern */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Add URL Pattern
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPattern}
                  onChange={(e) =>
                    setNewPattern((e.target as HTMLInputElement).value)
                  }
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPattern()}
                  placeholder="e.g., *api.example.com*, */users/*, example.com"
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={handleAddPattern}
                  disabled={!newPattern.trim()}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
                    activeTab === 'whitelist'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
                  }`}
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use * for wildcards. Patterns are case-insensitive.
              </p>
            </div>

            {/* Pattern List */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {activeTab === 'whitelist' ? 'Whitelist' : 'Blacklist'} Rules
              </h4>
              <div className="space-y-2">
                {currentList.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      rule.isActive
                        ? activeTab === 'whitelist'
                          ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                          : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <button
                        onClick={() => {
                          if (activeTab === 'whitelist') {
                            toggleWhitelistRule(rule.id);
                          } else {
                            toggleBlacklistRule(rule.id);
                          }
                        }}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          rule.isActive
                            ? activeTab === 'whitelist'
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-red-500 border-red-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {rule.isActive && (
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                          {rule.pattern}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Added {rule.addedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (activeTab === 'whitelist') {
                          removeFromWhitelist(rule.id);
                        } else {
                          removeFromBlacklist(rule.id);
                        }
                      }}
                      className="flex-shrink-0 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-600 dark:text-red-400"
                      title="Remove rule"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {currentList.length === 0 && (
                  <div className="text-center py-8">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        activeTab === 'whitelist'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 ${
                          activeTab === 'whitelist'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      No {activeTab} rules
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Add a pattern to start filtering URLs
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollFadeContainer>
      </div>
    </>
  );

  return createPortal(portalContent, document.body);
};
