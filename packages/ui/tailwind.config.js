const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  content: ["./components/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      hue: {
        light: "#ffffff",
        header: "#FAFAFA",
        dark: "#0F111A",
      },
      hover: {
        light: "#E5E8EB",
      },
      white: colors.white,
      primary: colors.red,
      lightGray: "#FAFAFA",
      darkGrey: "#888888",
      mediumGrey: "#eaeaea",
      redDot: "#FF5555",
      greenDot: "#86D893",
      black: "#2C2C2C",
      disabledGray: "#D7D7D7",
      blueHighlight: "#0070F3",
      blueHighlightLight: "#3291FF",
      redError: "#EE0000",
    },
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', "sans-serif"],
      normal: ['"Plus Jakarta Sans"', "sans-serif"],
      "plus-jakarta-sans": ['"Plus Jakarta Sans"', "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1536px",
      "4xl": "2048px",
      "5xl": "2560px",
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    }),
  ],
};
