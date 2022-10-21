const config = require('@elevateart/ui/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: ['./src/**/**/*.{js,ts,jsx,tsx}'],
}
