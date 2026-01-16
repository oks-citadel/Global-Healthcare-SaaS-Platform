import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/generated/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'vitest.config.ts',
      'prisma/**',
    ],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-namespace': 'off', // Allow namespace for module augmentation (e.g., Express)
      'no-console': 'off',
      'prefer-const': 'error',
    },
  }
);
