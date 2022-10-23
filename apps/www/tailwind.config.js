const ui = require('@elevateart/ui/tailwind')

module.exports = {
  presets: [ui],
  darkMode: 'class',
  content: ui.content.concat(['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}']),
}
