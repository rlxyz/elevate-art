const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./components/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    /**
     * We use CSS variables defined in styles/globals.css to define color values.
     * Source: https://tailwindcss.com/docs/customizing-colors#using-css-variables
     */
    colors: {
      transparent: "transparent",
      background: "rgb(var(--background) / 1.0)",
      foreground: "rgb(var(--foreground) / 1.0)",
      accents_1: "rgb(var(--accents_1) / 1.0)",
      accents_2: "rgb(var(--accents_2) / 1.0)",
      accents_3: "rgb(var(--accents_3) / 1.0)",
      accents_4: "rgb(var(--accents_4) / 1.0)",
      accents_5: "rgb(var(--accents_5) / 1.0)",
      accents_6: "rgb(var(--accents_6) / 1.0)",
      accents_7: "rgb(var(--accents_7) / 1.0)",
      accents_8: "rgb(var(--accents_8) / 1.0)",
      accents_9: "rgb(var(--accents_9) / 1.0)",
      border: "rgb(var(--border) / 1.0)",
      error: "rgb(var(--error) / 1.0)",
      success: "rgb(var(--success) / 1.0)",
      link: "rgb(var(--link) / 1.0)",
      linkLighter: "rgb(var(--linkLighter) / 1.0)",
    },
    borderRadius: {
      primary: "5px",
      secondary: "4px",
      tertiary: "3px",
      full: "9999px",
    },
    /** All screen sizes that this UI library handles. Extend this list if you want to add more screen sizes */
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
    /** All fonts that we handle */
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', "sans-serif"],
      normal: ['"Plus Jakarta Sans"', "sans-serif"],
      "plus-jakarta-sans": ['"Plus Jakarta Sans"', "sans-serif"],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      /** Little hack for components that do not want to show the scrollbar. Usage: `no-scrollbar` in a components className */
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
