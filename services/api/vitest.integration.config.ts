import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "tests/integration/**/*.test.ts",
      "tests/integration/**/*.spec.ts",
    ],
    exclude: ["node_modules", "dist"],
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 30000,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
