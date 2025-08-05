import { useState, useCallback } from 'preact/hooks';

interface UseSearchStateProps {
  onSearchClose?: () => void;
}

interface UseSearchStateReturn {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  handleOpen: () => void;
  handleClose: () => void;
  handleQueryChange: (newQuery: string) => void;
  setSelectedIndex: (index: number) => void;
}

/**
 * Hook for managing global search state
 * Handles: isOpen, query, selectedIndex state and their transitions
 */
export const useSearchState = ({
  onSearchClose,
}: UseSearchStateProps = {}): UseSearchStateReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSelectedIndex(-1);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);

    // Call the optional callback to restore focus to the log container
    // This allows arrow key navigation to continue working after search closes
    if (onSearchClose) {
      // Use setTimeout to ensure the search UI is fully closed before attempting to refocus
      setTimeout(() => {
        onSearchClose();
      }, 0);
    }
  }, [onSearchClose]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(-1); // Reset selection when query changes - this addresses point #2
  }, []);

  return {
    isOpen,
    query,
    selectedIndex,
    handleOpen,
    handleClose,
    handleQueryChange,
    setSelectedIndex,
  };
};
