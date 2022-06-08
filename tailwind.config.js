const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      hue: {
        light: '#F5F1EB', // example usage
        dark: '#0F111A',
      },
      white: colors.white,
      primary: colors.red,
      gray: '#E7E7E7',
      redDot: '#FF5555',
      greenDot: '#86D893',
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
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'sans-serif'],
      normal: ['Plus Jakarta Sans', 'sans-serif'],
      'gilroy-extra-bold': ['"Gilroy-ExtraBold"', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
}
