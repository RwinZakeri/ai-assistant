import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-dupe-keys': 'error',
      'jsx-a11y/alt-text': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'off',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      '@typescript-eslint/no-explicit-any': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],
      'no-fallthrough': ['error', { commentPattern: 'falls through' }],
      'import/no-self-import': 'error',
      'import/newline-after-import': 'warn', // todo: change with ignored cases of svgs
      'import/first': 'error',
      'react/jsx-sort-props': [
        'off',
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: 'last',
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
          locale: 'auto',
        },
      ],
      curly: 'off',
      'object-shorthand': ['error', 'properties'],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/self-closing-comp': 'error',
      'unused-imports/no-unused-imports': 'error',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: ['**/*.md', '**/node_modules', '.next/'],
  },
];

export default eslintConfig;
