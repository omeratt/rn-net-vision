/** @jsxImportSource preact */
import { createContext } from 'preact';
import { useState, useEffect, useContext, useCallback } from 'preact/hooks';

export interface UrlFilterRule {
  id: string;
  pattern: string;
  isActive: boolean;
  addedAt: Date;
}

export interface UrlFilterState {
  whitelist: UrlFilterRule[];
  blacklist: UrlFilterRule[];
  isWhitelistEnabled: boolean;
  isBlacklistEnabled: boolean;
}

interface UrlFilterContextType {
  // State
  whitelist: UrlFilterRule[];
  blacklist: UrlFilterRule[];
  isWhitelistEnabled: boolean;
  isBlacklistEnabled: boolean;

  // Whitelist actions
  addToWhitelist: (pattern: string) => void;
  removeFromWhitelist: (id: string) => void;
  toggleWhitelistRule: (id: string) => void;
  toggleWhitelistEnabled: () => void;

  // Blacklist actions
  addToBlacklist: (pattern: string) => void;
  removeFromBlacklist: (id: string) => void;
  toggleBlacklistRule: (id: string) => void;
  toggleBlacklistEnabled: () => void;

  // Filtering
  shouldShowUrl: (url: string) => boolean;
  clearAllFilters: () => void;

  // Stats
  getActiveFiltersCount: () => number;
}

const STORAGE_KEY = 'netvision-url-filters';
const DEFAULT_STATE: UrlFilterState = {
  whitelist: [],
  blacklist: [],
  isWhitelistEnabled: false,
  isBlacklistEnabled: false,
};

export const UrlFilterContext = createContext<UrlFilterContextType>({
  whitelist: [],
  blacklist: [],
  isWhitelistEnabled: false,
  isBlacklistEnabled: false,
  addToWhitelist: () => {},
  removeFromWhitelist: () => {},
  toggleWhitelistRule: () => {},
  toggleWhitelistEnabled: () => {},
  addToBlacklist: () => {},
  removeFromBlacklist: () => {},
  toggleBlacklistRule: () => {},
  toggleBlacklistEnabled: () => {},
  shouldShowUrl: () => true,
  clearAllFilters: () => {},
  getActiveFiltersCount: () => 0,
});

export interface UrlFilterProviderProps {
  children: preact.ComponentChildren;
}

// Helper function to check if URL matches pattern
const matchesPattern = (url: string, pattern: string): boolean => {
  try {
    // Support simple wildcards and regex-like patterns
    const regexPattern = pattern
      .replace(/\*/g, '.*') // Convert * to .*
      .replace(/\?/g, '.'); // Convert ? to .

    const regex = new RegExp(regexPattern, 'i'); // Case insensitive
    return regex.test(url);
  } catch {
    // Fallback to simple string includes if regex fails
    return url.toLowerCase().includes(pattern.toLowerCase());
  }
};

export const UrlFilterProvider = ({ children }: UrlFilterProviderProps) => {
  const [state, setState] = useState<UrlFilterState>(DEFAULT_STATE);

  // Load filters from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const processedState: UrlFilterState = {
          ...parsed,
          whitelist:
            parsed.whitelist?.map((rule: any) => ({
              ...rule,
              addedAt: new Date(rule.addedAt),
            })) || [],
          blacklist:
            parsed.blacklist?.map((rule: any) => ({
              ...rule,
              addedAt: new Date(rule.addedAt),
            })) || [],
        };
        setState(processedState);
      }
    } catch (error) {
      console.error('[UrlFilterContext] Failed to load saved filters:', error);
      setState(DEFAULT_STATE);
    }
  }, []);

  // Save filters to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('[UrlFilterContext] Failed to save filters:', error);
    }
  }, [state]);

  // Whitelist actions
  const addToWhitelist = useCallback((pattern: string) => {
    if (!pattern.trim()) return;

    const newRule: UrlFilterRule = {
      id: crypto.randomUUID(),
      pattern: pattern.trim(),
      isActive: true,
      addedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      whitelist: [...prev.whitelist, newRule],
    }));
  }, []);

  const removeFromWhitelist = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      whitelist: prev.whitelist.filter((rule) => rule.id !== id),
    }));
  }, []);

  const toggleWhitelistRule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      whitelist: prev.whitelist.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      ),
    }));
  }, []);

  const toggleWhitelistEnabled = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isWhitelistEnabled: !prev.isWhitelistEnabled,
    }));
  }, []);

  // Blacklist actions
  const addToBlacklist = useCallback((pattern: string) => {
    if (!pattern.trim()) return;

    const newRule: UrlFilterRule = {
      id: crypto.randomUUID(),
      pattern: pattern.trim(),
      isActive: true,
      addedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      blacklist: [...prev.blacklist, newRule],
    }));
  }, []);

  const removeFromBlacklist = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      blacklist: prev.blacklist.filter((rule) => rule.id !== id),
    }));
  }, []);

  const toggleBlacklistRule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      blacklist: prev.blacklist.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      ),
    }));
  }, []);

  const toggleBlacklistEnabled = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isBlacklistEnabled: !prev.isBlacklistEnabled,
    }));
  }, []);

  // Filtering logic
  const shouldShowUrl = useCallback(
    (url: string): boolean => {
      // If whitelist is enabled and has active rules
      if (state.isWhitelistEnabled) {
        const activeWhitelistRules = state.whitelist.filter(
          (rule) => rule.isActive
        );
        if (activeWhitelistRules.length > 0) {
          // URL must match at least one whitelist rule
          const matchesWhitelist = activeWhitelistRules.some((rule) =>
            matchesPattern(url, rule.pattern)
          );
          if (!matchesWhitelist) return false;
        }
      }

      // If blacklist is enabled and has active rules
      if (state.isBlacklistEnabled) {
        const activeBlacklistRules = state.blacklist.filter(
          (rule) => rule.isActive
        );
        if (activeBlacklistRules.length > 0) {
          // URL must not match any blacklist rule
          const matchesBlacklist = activeBlacklistRules.some((rule) =>
            matchesPattern(url, rule.pattern)
          );
          if (matchesBlacklist) return false;
        }
      }

      return true;
    },
    [
      state.isWhitelistEnabled,
      state.isBlacklistEnabled,
      state.whitelist,
      state.blacklist,
    ]
  );

  const clearAllFilters = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const getActiveFiltersCount = useCallback((): number => {
    let count = 0;
    if (state.isWhitelistEnabled) {
      count += state.whitelist.filter((rule) => rule.isActive).length;
    }
    if (state.isBlacklistEnabled) {
      count += state.blacklist.filter((rule) => rule.isActive).length;
    }
    return count;
  }, [state]);

  return (
    <UrlFilterContext.Provider
      value={{
        whitelist: state.whitelist,
        blacklist: state.blacklist,
        isWhitelistEnabled: state.isWhitelistEnabled,
        isBlacklistEnabled: state.isBlacklistEnabled,
        addToWhitelist,
        removeFromWhitelist,
        toggleWhitelistRule,
        toggleWhitelistEnabled,
        addToBlacklist,
        removeFromBlacklist,
        toggleBlacklistRule,
        toggleBlacklistEnabled,
        shouldShowUrl,
        clearAllFilters,
        getActiveFiltersCount,
      }}
    >
      {children}
    </UrlFilterContext.Provider>
  );
};

export const useUrlFilter = () => useContext(UrlFilterContext);
