module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js)': (filenames) => [
    `yarn format ${filenames.join(' ')}`,
    `yarn lint:fix ${filenames.join(' ')}`,
  ],

  // Format stylesheet file
  '**/*.(css|scss)': (filenames) => [`yarn format ${filenames.join(' ')}`],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) => `yarn format ${filenames.join(' ')}`,
}
