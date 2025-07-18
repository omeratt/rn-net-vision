/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      maxHeight: {
        'dynamic-content': 'calc(100vh - 16rem)',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
