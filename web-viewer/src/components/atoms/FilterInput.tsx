/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

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
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setIsActive(value !== '');
  }, [value]);

  const baseClasses = `
    relative w-full px-4 py-3 text-sm
    bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm
    border border-white/30 dark:border-gray-600/30
    rounded-xl shadow-lg
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30
    focus:border-indigo-500 dark:focus:border-indigo-400
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isFocused ? 'ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-xl' : ''}
    ${isActive ? 'bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-400/70 dark:border-indigo-500/70 shadow-indigo-500/20' : ''}
    hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-xl
    ${disabled ? '' : 'hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-white/80 dark:hover:from-gray-700/80 dark:hover:to-gray-600/80'}
  `;

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

  if (type === 'select' && options.length > 0) {
    return (
      <div className={`relative ${className}`}>
        <select
          ref={inputRef as any}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          aria-label={ariaLabel}
          className={`${baseClasses} pr-12 appearance-none cursor-pointer`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow with enhanced styling */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <div className="p-1 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 shadow-sm">
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                isFocused
                  ? 'text-indigo-500 dark:text-indigo-400 scale-110'
                  : 'text-gray-400 dark:text-gray-500'
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
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <div
            className={`transition-all duration-300 p-1 rounded-lg ${
              isFocused
                ? 'text-indigo-500 dark:text-indigo-400 scale-110 bg-indigo-100/50 dark:bg-indigo-900/50'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
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
        className={`${baseClasses} ${icon ? 'pl-12' : ''}`}
      />

      {/* Active indicator with enhanced styling */}
      {isActive && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" />
        </div>
      )}
    </div>
  );
};
