/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { DropdownPortal } from './DropdownPortal';

interface FilterInputProps {
  'type'?: 'text' | 'select';
  'placeholder'?: string;
  'value': string | string[];
  'options'?: Array<{ value: string; label: string }>;
  'onChange': (value: string | string[]) => void;
  'icon'?: VNode;
  'disabled'?: boolean;
  'className'?: string;
  'aria-label'?: string;
  'multiSelect'?: boolean;
}

export const FilterInput = ({
  type = 'text',
  placeholder,
  value,
  options = [],
  onChange,
  icon,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  multiSelect = false,
}: FilterInputProps): VNode => {
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (multiSelect) {
      const valueArray = Array.isArray(value) ? value : [];
      setIsActive(valueArray.length > 0);
    } else {
      const valueString = Array.isArray(value) ? '' : value;
      setIsActive(valueString !== '');
    }
  }, [value, multiSelect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        // In multi-select mode, don't close on click inside dropdown
        if (multiSelect) {
          const dropdownElement = (event.target as Element).closest(
            '.dropdown-portal-content'
          );
          if (dropdownElement) {
            return; // Don't close if clicking inside dropdown
          }
        }
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, multiSelect]);

  const baseClasses = `
    relative w-full px-4 py-3 text-sm
    bg-white/90 dark:bg-gray-800/90 
    border border-gray-200 dark:border-gray-600
    rounded-xl shadow-lg
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    transition-all duration-300 ease-out
    focus:outline-none
    focus:border-indigo-500 dark:focus:border-indigo-400
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isFocused || isOpen ? 'shadow-xl transform scale-[1.02] ' : ''}
    ${isActive ? 'bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-indigo-900/30 dark:to-blue-900/30 ' : ''}
    hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-200/30 dark:hover:shadow-indigo-900/30
    ${disabled ? '' : 'hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-blue-50/50 dark:hover:from-gray-700/50 dark:hover:to-indigo-900/30 hover:scale-[1.01]'}
  `;

  const textInputClasses = `${baseClasses}`;
  const selectButtonClasses = `${baseClasses} pr-16 text-left cursor-pointer w-full flex items-center group`;

  // Handle text input with icon spacing
  const getTextInputClasses = () => {
    if (icon) {
      return `${textInputClasses} pl-14`; // More space for icon
    }
    return textInputClasses;
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    onChange(target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleOptionSelect = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
      // Don't close dropdown in multi-select mode
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const removeSelectedItem = (itemValue: string) => {
    if (multiSelect && Array.isArray(value)) {
      const newValues = value.filter((v) => v !== itemValue);
      onChange(newValues);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const getSelectedLabel = () => {
    if (multiSelect) {
      const selectedValues = Array.isArray(value) ? value : [];
      if (selectedValues.length === 0) {
        return placeholder || 'Select options';
      } else if (selectedValues.length === 1) {
        const selectedOption = options.find(
          (opt) => opt.value === selectedValues[0]
        );
        return selectedOption?.label || selectedValues[0];
      } else {
        return `${selectedValues.length} selected`;
      }
    } else {
      const stringValue = Array.isArray(value) ? '' : value;
      const selectedOption = options.find((opt) => opt.value === stringValue);
      return selectedOption
        ? selectedOption.label
        : placeholder || 'Select option';
    }
  };

  // Helper function to get status colors
  const getStatusColors = (status: string) => {
    const statusNum = parseInt(status, 10);
    if (statusNum < 300)
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700';
    if (statusNum < 400)
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700';
    return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700';
  };

  // Helper function to get method colors
  const getMethodColors = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'PUT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  // Helper function to determine chip colors based on value type
  const getChipColors = (selectedValue: string) => {
    // Check if it's a status code (numeric)
    if (/^\d+$/.test(selectedValue)) {
      return getStatusColors(selectedValue);
    }
    // Check if it's a common HTTP method
    const httpMethods = [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'HEAD',
      'OPTIONS',
    ];
    if (httpMethods.includes(selectedValue.toUpperCase())) {
      return getMethodColors(selectedValue);
    }
    // Fallback to placeholder-based detection
    if (placeholder?.toLowerCase().includes('status')) {
      return getStatusColors(selectedValue);
    } else if (placeholder?.toLowerCase().includes('method')) {
      return getMethodColors(selectedValue);
    }
    return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700';
  };

  const isOptionSelected = (optionValue: string): boolean => {
    if (multiSelect) {
      const selectedValues = Array.isArray(value) ? value : [];
      return selectedValues.includes(optionValue);
    } else {
      const stringValue = Array.isArray(value) ? '' : value;
      return stringValue === optionValue;
    }
  };

  // Custom dropdown for select type
  if (type === 'select' && options.length > 0) {
    return (
      <div className={`relative ${className}`}>
        {/* Custom select button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          aria-label={ariaLabel}
          className={selectButtonClasses}
        >
          {/* Multi-select chips display */}
          {multiSelect && Array.isArray(value) && value.length > 0 ? (
            <div className="flex flex-wrap gap-1 mr-4 flex-1">
              {value.slice(0, 2).map((selectedValue) => {
                const chipColors = getChipColors(selectedValue);
                return (
                  <div
                    key={selectedValue}
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${chipColors}`}
                  >
                    <span className="font-mono font-bold">{selectedValue}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedItem(selectedValue);
                      }}
                      className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
              {value.length > 2 && (
                <div className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600">
                  +{value.length - 2}
                </div>
              )}
            </div>
          ) : (
            <span
              className={`transition-colors duration-200 flex-1 mr-4 ${
                (multiSelect ? Array.isArray(value) && value.length > 0 : value)
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {getSelectedLabel()}
            </span>
          )}

          {/* Enhanced dropdown arrow with fixed positioning */}
          <div
            className={`p-2 rounded-xl transition-all duration-300 absolute right-3 ${
              isOpen || isFocused
                ? 'bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-800/50 dark:to-blue-800/50 shadow-lg scale-110'
                : 'bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-600/50 dark:to-gray-700/50'
            }`}
          >
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                isOpen
                  ? 'text-indigo-600 dark:text-indigo-400 rotate-180'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* Custom dropdown menu using DropdownPortal */}
        <DropdownPortal
          isOpen={isOpen}
          anchorRef={buttonRef}
          onClose={() => setIsOpen(false)}
        >
          <div className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl overflow-hidden">
            {/* Header for multi-select */}
            {multiSelect && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select multiple options
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsFocused(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {multiSelect && Array.isArray(value) && value.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {value.length} item{value.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            )}

            <div className="py-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full px-4 py-3 text-left flex items-center space-x-3 
                    transition-all duration-200 ease-out group relative overflow-hidden
                    hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/50 
                    dark:hover:from-gray-700/50 dark:hover:to-indigo-900/20 
                    hover:scale-[1.005] hover:translate-x-0.5 ${
                      isOptionSelected(option.value)
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-l-4 border-indigo-400'
                        : ''
                    }
                  `}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Checkbox for multi-select or dot indicator for single select */}
                    {multiSelect ? (
                      <div
                        className={`w-4 h-4 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                          isOptionSelected(option.value)
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400'
                        }`}
                      >
                        {isOptionSelected(option.value) && (
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
                      </div>
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          isOptionSelected(option.value)
                            ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-500'
                        }`}
                      />
                    )}

                    {/* Option label with color badge */}
                    <div className="flex items-center space-x-2 flex-1">
                      {/* Color badge for status/method */}
                      <div
                        className={`px-2 py-1 rounded text-xs font-mono font-bold ${getChipColors(option.value)}`}
                      >
                        {option.value}
                      </div>
                      <span
                        className={`text-sm transition-colors duration-200 ${
                          isOptionSelected(option.value)
                            ? 'text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  </div>

                  {/* Selected indicator for single select */}
                  {!multiSelect && isOptionSelected(option.value) && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-indigo-500 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Hover shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DropdownPortal>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
          <div className="w-6 h-6 bg-indigo-100/80 dark:bg-gray-700/80 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            {icon}
          </div>
        </div>
      )}

      <input
        ref={inputRef as any}
        type="text"
        value={Array.isArray(value) ? '' : value}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        aria-label={ariaLabel}
        className={getTextInputClasses()}
      />

      {/* Active indicator with enhanced styling */}
      {isActive && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" />
        </div>
      )}
    </div>
  );
};
