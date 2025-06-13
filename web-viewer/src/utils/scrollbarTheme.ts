/**
 * Scrollbar theme utilities for dynamic CSS injection
 */

const SCROLLBAR_STYLE_ID = 'dynamic-scrollbar-theme';

const LIGHT_MODE_STYLES = `
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f3f4f6 !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #d1d5db !important;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af !important;
  }
  .refined-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .refined-scrollbar::-webkit-scrollbar-track {
    background: transparent !important;
  }
  .refined-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db !important;
    border-radius: 3px;
    opacity: 0.6;
  }
  .refined-scrollbar:hover::-webkit-scrollbar-thumb {
    opacity: 1;
    background: #9ca3af !important;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f3f4f6;
  }
`;

const DARK_MODE_STYLES = `
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #1f2937 !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #4b5563 !important;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #6b7280 !important;
  }
  .refined-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .refined-scrollbar::-webkit-scrollbar-track {
    background: transparent !important;
  }
  .refined-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563 !important;
    border-radius: 3px;
    opacity: 0.6;
  }
  .refined-scrollbar:hover::-webkit-scrollbar-thumb {
    opacity: 1;
    background: #6b7280 !important;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: #4b5563 #1f2937;
  }
`;

/**
 * Updates scrollbar theme by injecting CSS styles dynamically
 */
export const updateScrollbarTheme = (isDarkMode: boolean): void => {
  // Remove existing scrollbar styles
  const existingStyle = document.getElementById(SCROLLBAR_STYLE_ID);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create and inject new theme-specific styles
  const styleElement = document.createElement('style');
  styleElement.id = SCROLLBAR_STYLE_ID;
  styleElement.textContent = isDarkMode ? DARK_MODE_STYLES : LIGHT_MODE_STYLES;
  document.head.appendChild(styleElement);
};

/**
 * Forces scrollbar repaint for better cross-browser support
 */
export const forceScrollbarRepaint = (): void => {
  // Force reflow
  document.body.offsetHeight;

  // Force repaint on scroll containers
  const scrollElements = document.querySelectorAll(
    '.overflow-auto, .overflow-y-auto, .overflow-x-auto, .refined-scrollbar'
  );

  scrollElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const originalOverflow = htmlElement.style.overflow;
    htmlElement.style.overflow = 'hidden';
    htmlElement.offsetHeight; // Force reflow
    htmlElement.style.overflow = originalOverflow || '';
  });
};
