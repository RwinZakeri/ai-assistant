const buildTscCommand = () => 'tsc --noEmit';

module.exports = {
  '**/*.{ts,tsx}': [buildTscCommand, 'eslint --fix', 'prettier --write'],
};
