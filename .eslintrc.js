module.exports = {
  plugins: ['prettier'],
  extends: ['next/core-web-vitals'],
  rules: {
    'no-console': 'error',
    'prettier/prettier': 'warn',
    'react-hooks/exhaustive-deps': 'off',
  },
};
