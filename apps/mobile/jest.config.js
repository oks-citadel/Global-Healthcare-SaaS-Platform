const { defaults: jestExpoDefaults } = require("jest-expo/config");

module.exports = {
  ...jestExpoDefaults,
  testEnvironmentOptions: {
    customExportConditions: ["react-native"],
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.config.js",
    "!**/app/**",
    "!**/src/hooks/useBilling.ts",
    "!**/src/hooks/useBooking.ts",
    "!**/src/hooks/useMedicalRecords.ts",
    "!**/src/hooks/useMessaging.ts",
    "!**/src/hooks/useProviders.ts",
    "!**/src/hooks/usePushNotifications.ts",
    "!**/src/types/healthcare.ts",
    "!**/src/config/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  globals: {
    localStorage: {},
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "json", "html"],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
