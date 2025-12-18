/**
 * UnifiedHealth Platform - ESLint Security Configuration
 *
 * This configuration extends the base ESLint setup with security-focused rules
 * to detect common vulnerabilities and insecure coding patterns.
 *
 * Security Rules Include:
 * - SQL Injection prevention
 * - XSS prevention
 * - Command Injection detection
 * - Insecure cryptographic practices
 * - Regular expression DoS (ReDoS)
 * - And more...
 */

module.exports = {
  extends: [
    'plugin:security/recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: [
    'security',
    'no-secrets',
  ],

  rules: {
    // =============================================
    // Security Rules - Critical
    // =============================================

    // Detect potential SQL injections
    'security/detect-sql-injection': 'error',

    // Detect eval() usage which can lead to code injection
    'security/detect-eval-with-expression': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Detect non-literal fs filenames (path traversal)
    'security/detect-non-literal-fs-filename': 'warn',

    // Detect non-literal require (code injection)
    'security/detect-non-literal-require': 'error',

    // Detect child process execution (command injection)
    'security/detect-child-process': 'warn',

    // Detect unsafe RegExp patterns (ReDoS)
    'security/detect-unsafe-regex': 'error',

    // Detect buffer noAssert usage
    'security/detect-buffer-noassert': 'error',

    // Detect pseudoRandomBytes usage (cryptographically weak)
    'security/detect-pseudoRandomBytes': 'error',

    // Detect new Buffer() usage (deprecated and unsafe)
    'security/detect-new-buffer': 'error',

    // Detect possible timing attacks
    'security/detect-possible-timing-attacks': 'warn',

    // =============================================
    // Secret Detection
    // =============================================

    // Detect hardcoded secrets
    'no-secrets/no-secrets': ['error', {
      'tolerance': 4.5,
      'ignoreContent': [
        'test',
        'example',
        'demo',
        'sample',
        'XXXXX',
      ],
      'ignoreIdentifiers': [
        'publicKey',
        'testSecret',
        'mockToken',
      ],
    }],

    // =============================================
    // XSS Prevention
    // =============================================

    // Prevent dangerouslySetInnerHTML in React
    'react/no-danger': 'warn',

    // Prevent usage of javascript: protocol
    'no-script-url': 'error',

    // =============================================
    // Cryptographic Security
    // =============================================

    // Detect insecure object property lookup
    'security/detect-object-injection': 'off', // Too many false positives

    // Require crypto.randomBytes instead of Math.random for security-sensitive code
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
        message: 'Use crypto.randomBytes() for security-sensitive random values',
      },
    ],

    // =============================================
    // General Security Best Practices
    // =============================================

    // Prevent use of deprecated/unsafe APIs
    'no-restricted-globals': [
      'error',
      {
        name: 'event',
        message: 'Use local event parameter instead of global event object',
      },
    ],

    // Prevent prototype pollution
    'no-prototype-builtins': 'error',

    // Require strict mode
    'strict': ['error', 'global'],

    // Prevent console.log in production (security through obscurity)
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // Prevent debugger statements in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // =============================================
    // TypeScript Security
    // =============================================

    // Prevent any type (reduces type safety)
    '@typescript-eslint/no-explicit-any': 'warn',

    // Prevent non-null assertions (can hide errors)
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Require explicit return types on functions
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],

    // Prevent unused variables (can indicate incomplete security checks)
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],

    // =============================================
    // API Security
    // =============================================

    // Prevent sensitive data in URLs
    'no-restricted-properties': [
      'error',
      {
        object: 'window',
        property: 'location',
        message: 'Avoid putting sensitive data in URLs',
      },
    ],

    // =============================================
    // Healthcare-Specific Security (HIPAA)
    // =============================================

    // Custom rules for healthcare data protection
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'crypto',
            importNames: ['createHash'],
            message: 'Use bcrypt or argon2 for password hashing, not crypto.createHash',
          },
        ],
        patterns: [
          {
            group: ['**/patient-data/*'],
            message: 'Direct import of patient data modules is restricted. Use service layer.',
          },
        ],
      },
    ],
  },

  // Override rules for specific file patterns
  overrides: [
    {
      // Test files can have relaxed rules
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'security/detect-non-literal-fs-filename': 'off',
        'security/detect-child-process': 'off',
        'no-secrets/no-secrets': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      // Configuration files
      files: ['**/*.config.js', '**/*.config.ts'],
      rules: {
        'security/detect-non-literal-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // Scripts
      files: ['scripts/**/*.js', 'scripts/**/*.ts'],
      rules: {
        'no-console': 'off',
        'security/detect-child-process': 'warn',
      },
    },
  ],

  // Environment-specific globals
  env: {
    node: true,
    es2022: true,
    browser: true,
  },

  // Parser options
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
