import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      DEMO_MODE: "true",
      NODE_ENV: "test",
      STRIPE_WEBHOOK_SECRET: "whsec_test_secret",
      STRIPE_SECRET_KEY: "sk_test_mock_key",
    },
    include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
    exclude: [
      "node_modules",
      "dist",
      "tests/webhooks/**",
      "tests/integration/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts", "src/index.ts", "src/lib/prisma.ts"],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
