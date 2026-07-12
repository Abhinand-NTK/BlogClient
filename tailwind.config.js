import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff5ff',
          100: '#dbe8fe',
          200: '#bfd7fe',
          300: '#93bbfd',
          400: '#6096fa',
          500: '#3b76f6',
          600: '#2559eb',
          700: '#1d45d8',
          800: '#1e3aaf',
          900: '#1e368a',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        highlight: {
          400: '#fb923c',
          500: '#f97316',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          800: '#1b2130',
          900: '#12161f',
          950: '#0b0e15',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(16 22 31 / 0.08), 0 6px 24px -8px rgb(16 22 31 / 0.10)',
        glow: '0 0 0 1px rgb(59 118 246 / 0.15), 0 12px 40px -12px rgb(59 118 246 / 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
};
