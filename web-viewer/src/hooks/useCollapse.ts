import { useState, useCallback } from 'preact/hooks';

export interface UseCollapseReturn {
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
}

export const useCollapse = (initialState = true): UseCollapseReturn => {
  const [isCollapsed, setIsCollapsed] = useState(initialState);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  return {
    isCollapsed,
    toggle,
    expand,
    collapse,
  };
};
