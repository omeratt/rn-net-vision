/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { DropdownPortal } from './DropdownPortal';

interface FilterInputProps {
  'type'?: 'text' | 'select';
  'placeholder'?: string;
  'value': string;
  'options'?: Array<{ value: string; label: string }>;
  'onChange': (value: string) => void;
  'icon'?: VNode;
  'disabled'?: boolean;
  'className'?: string;
  'aria-label'?: string;
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
}: FilterInputProps): VNode => {
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsActive(value !== '');
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const baseClasses = `
    relative w-full px-4 py-3 text-sm
    bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
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
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const getSelectedLabel = () => {
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption
      ? selectedOption.label
      : placeholder || 'Select option';
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
          <span
            className={`transition-colors duration-200 flex-1 mr-4 ${
              value
                ? 'text-gray-900 dark:text-gray-100 font-medium'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {getSelectedLabel()}
          </span>

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
                      value === option.value
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-l-4 border-indigo-400'
                        : ''
                    }
                  `}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Option icon/indicator */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        value === option.value
                          ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50 scale-125'
                          : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-500'
                      }`}
                    />

                    {/* Option label */}
                    <span
                      className={`text-sm transition-colors duration-200 ${
                        value === option.value
                          ? 'text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>

                  {/* Selected indicator */}
                  {value === option.value && (
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
        value={value}
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
