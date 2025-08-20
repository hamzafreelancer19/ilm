/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core brand palette
        brand: {
          100: '#CCFBF1',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        info: {
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        ai: {
          100: '#F3E8FF',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          900: '#581C87',
        },
        success: {
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        // Light theme
        light: {
          background: '#F9FAFB',
          surface: '#FFFFFF',
          'text-primary': '#0F172A',
          'text-secondary': '#475569',
          border: '#E5E7EB',
        },
        // Dark theme
        dark: {
          background: '#0F172A',
          surface: '#1E293B',
          'text-primary': '#F8FAFC',
          'text-secondary': '#CBD5E1',
          border: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '2.5rem' }], // text-3xl
        'h1': ['2.25rem', { lineHeight: '2.5rem' }], // text-3xl
        'h2': ['1.5rem', { lineHeight: '2rem' }], // text-2xl
        'h3': ['1.25rem', { lineHeight: '1.75rem' }], // text-xl
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '7xl': '80rem',
      },
      transitionProperty: {
        'all': 'all',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 