const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  // purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      hue: {
        light: '#FDFDF9',
        header: '#FAFAFA',
        dark: '#0F111A',
      },
      white: colors.white,
      primary: colors.red,
      lightGray: '#E7E7E7',
      darkGrey: '#959595',
      redDot: '#FF5555',
      greenDot: '#86D893',
      black: '#2C2C2C',
      disabledGray: '#D7D7D7',
      blueHighlight: '#6484F3',
      redError: '#FF5555',
    },
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      normal: ['"Plus Jakarta Sans"', 'sans-serif'],
      'plus-jakarta-sans': ['"Plus Jakarta Sans"', 'sans-serif'],
    },
    screens: {
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
