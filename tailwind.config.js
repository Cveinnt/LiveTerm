const config = require('./config.json');
const themes = require('./themes.json');

// Resolve colors from a named theme in themes.json when specified,
// otherwise fall back to inline colors in config.json
const colors =
  (config.theme && themes[config.theme]) ? themes[config.theme] : config.colors;

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
