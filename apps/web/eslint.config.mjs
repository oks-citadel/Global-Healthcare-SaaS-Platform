import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      // Ignore config files to avoid Node.js globals errors
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "postcss.config.js",
      "tailwind.config.js",
      "next.config.js",
      "cypress.config.ts",
      "vitest.config.ts",
      "e2e/playwright.config.ts",
    ],
  },

  // Main configuration for TypeScript/JavaScript files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "warn",

      // General rules
      "prefer-const": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      // ===================================================================
      // React Hooks Rules
      // ===================================================================
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ===================================================================
      // Accessibility Rules (WCAG 2.1 AA) via jsx-a11y
      // ===================================================================

      // Images must have alt text (WCAG 1.1.1 Level A)
      "jsx-a11y/alt-text": [
        "error",
        {
          elements: ["img", "object", "area", "input[type=\"image\"]"],
          img: ["Image", "Img"],
          object: ["Object"],
          area: ["Area"],
          "input[type=\"image\"]": ["InputImage"],
        },
      ],

      // Anchors must have href or role (WCAG 2.1.1 Level A)
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],

      // ARIA props must be valid (WCAG 4.1.2 Level A)
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/aria-role": [
        "error",
        {
          ignoreNonDOM: false,
        },
      ],

      // Interactive elements must be keyboard accessible (WCAG 2.1.1 Level A)
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],

      // Heading hierarchy must be logical (WCAG 1.3.1 Level A)
      "jsx-a11y/heading-has-content": "error",

      // HTML lang attribute (WCAG 3.1.1 Level A)
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/lang": "error",

      // IFrame must have title (WCAG 2.4.1, 4.1.2 Level A)
      "jsx-a11y/iframe-has-title": "error",

      // Images used as buttons must have accessible name (WCAG 4.1.2 Level A)
      "jsx-a11y/img-redundant-alt": "error",

      // Form labels (WCAG 1.3.1, 3.3.2 Level A)
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          labelComponents: ["Label"],
          labelAttributes: ["label"],
          controlComponents: ["Input", "Select", "Textarea"],
          depth: 3,
        },
      ],

      // Media elements need captions (WCAG 1.2.2, 1.2.3 Level A)
      "jsx-a11y/media-has-caption": [
        "error",
        {
          audio: ["Audio"],
          video: ["Video"],
          track: ["Track"],
        },
      ],

      // Mouse events must have keyboard equivalents (WCAG 2.1.1 Level A)
      "jsx-a11y/mouse-events-have-key-events": "error",

      // No access key (WCAG 2.4.1 Level A - conflicts with OS)
      "jsx-a11y/no-access-key": "error",

      // No autofocus (WCAG 2.4.3 Level A)
      "jsx-a11y/no-autofocus": [
        "error",
        {
          ignoreNonDOM: true,
        },
      ],

      // Don't use distracting elements (WCAG 2.2.2 Level A)
      "jsx-a11y/no-distracting-elements": [
        "error",
        {
          elements: ["marquee", "blink"],
        },
      ],

      // Interactive elements should not have tabIndex (WCAG 2.1.1 Level A)
      "jsx-a11y/no-noninteractive-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],

      // ARIA roles should not be redundant (WCAG 4.1.2 Level A)
      "jsx-a11y/no-redundant-roles": "error",

      // tabIndex should be -1, 0, or not present (WCAG 2.4.3 Level A)
      "jsx-a11y/tabindex-no-positive": "error",

      // Scope attribute on non-th/td elements (WCAG 1.3.1 Level A)
      "jsx-a11y/scope": "error",

      // Interactive elements should be focusable (WCAG 2.1.1 Level A)
      "jsx-a11y/interactive-supports-focus": [
        "error",
        {
          tabbable: [
            "button",
            "checkbox",
            "link",
            "searchbox",
            "spinbutton",
            "switch",
            "textbox",
          ],
        },
      ],

      // Role supports aria props (WCAG 4.1.2 Level A)
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",

      // Anchor elements should not have generic text
      "jsx-a11y/anchor-ambiguous-text": [
        "warn",
        {
          words: ["click here", "here", "link", "read more"],
        },
      ],

      // Prefer semantic HTML over div with role
      "jsx-a11y/prefer-tag-over-role": "warn",

      // Autocomplete attribute on inputs (WCAG 1.3.5 Level AA)
      "jsx-a11y/autocomplete-valid": [
        "error",
        {
          inputComponents: ["Input", "FormInput"],
        },
      ],
    },
  },

  // Test files - relax some rules
  {
    files: [
      "**/__tests__/**/*",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "tests/**/*",
      "e2e/**/*",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "jsx-a11y/no-autofocus": "off",
    },
  },

  // Cypress files - relax rules for Chai assertions and namespace declarations
  {
    files: ["cypress/**/*"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "jsx-a11y/no-autofocus": "off",
    },
  }
);
