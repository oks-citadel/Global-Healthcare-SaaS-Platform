import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-console': 'warn',
      'no-unused-vars': 'off', // Turned off in favor of @typescript-eslint/no-unused-vars
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'src/generated/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'vitest.config.ts',
      'coverage/**',
      'prisma/**',
    ],
  }
);
