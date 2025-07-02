// lint-staged.config.js
export default {
  '*.{ts,tsx,js,jsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,css}': ['prettier --write'],
  'commitlint.config.js': [], // Skip linting for this file
};
