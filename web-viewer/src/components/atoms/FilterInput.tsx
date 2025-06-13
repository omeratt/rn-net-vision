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
    relative w-full px-3 py-2 text-sm
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-600
    rounded-lg
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50
    focus:border-indigo-500 dark:focus:border-indigo-400
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isFocused ? 'ring-2 ring-indigo-500/30 dark:ring-indigo-400/30' : ''}
    ${isActive ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-500' : ''}
    hover:border-gray-400 dark:hover:border-gray-500
    ${disabled ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
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
          className={`${baseClasses} pr-8 appearance-none cursor-pointer`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`w-4 h-4 transition-colors duration-200 ${
              isFocused
                ? 'text-indigo-500 dark:text-indigo-400'
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
    );
  }

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <div
            className={`transition-colors duration-200 ${
              isFocused
                ? 'text-indigo-500 dark:text-indigo-400'
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
        className={`${baseClasses} ${icon ? 'pl-10' : ''}`}
      />

      {/* Active indicator */}
      {isActive && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};
