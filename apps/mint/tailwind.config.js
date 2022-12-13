const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  content: ['./src/**/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-bg-once': 'pulse-bg-once 2s ease-in forwards',
        'pulse-gradient-infinite': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-gradient-left-right': 'pulse 2s ease-in infinite',
      },
      keyframes: {
        'pulse-bg-once': {
          to: { backgroundColor: 'transparent' },
        },
        'pulse-gradient-infinite': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
    colors: {
      hue: {
        light: '#ffffff',
        header: '#FAFAFA',
        dark: '#0F111A',
      },
      hover: {
        light: '#E5E8EB',
      },
      white: colors.white,
      primary: colors.red,
      lightGray: '#FAFAFA',
      darkGrey: '#888888',
      mediumGrey: '#eaeaea',
      redDot: '#FF5555',
      greenDot: '#86D893',
      black: '#2C2C2C',
      disabledGray: '#D7D7D7',
      blueHighlight: '#0070F3',
      orangeWarning: '#fb923c',
      redError: '#EE0000',
      blue: '#6484F3',
      lightPink: '#FFB3B3',
      lightPurple: '#D296F0',
      lightBlue: '#A4E9FF',
      transparent: 'transparent',
    },
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      normal: ['"Plus Jakarta Sans"', 'sans-serif'],
      'plus-jakarta-sans': ['"Plus Jakarta Sans"', 'sans-serif'],
    },
    screens: {
      xs: '390px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1536px',
      '4xl': '2048px',
      '5xl': '2560px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      })
    }),
  ],
}
