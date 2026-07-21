import { FlatCompat } from '@eslint/eslintrc';
import pluginQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'next'),
  ...pluginQuery.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
