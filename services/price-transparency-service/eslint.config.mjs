import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: null,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      'no-console': 'warn',
      'no-case-declarations': 'warn',
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/generated/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
      'prisma/**',
    ],
  }
);
