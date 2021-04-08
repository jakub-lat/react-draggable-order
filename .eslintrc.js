module.exports = {
  'extends': [
    'airbnb-typescript-prettier',
    'plugin:react-hooks/recommended',
  ],
  'rules': {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/jsx-props-no-spreading': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-console': 0,
    'react/require-default-props': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 0,

  },
};