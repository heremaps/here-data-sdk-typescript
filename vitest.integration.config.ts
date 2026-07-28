import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/integration/olp-sdk-*/*.test.ts"],
        environment: "node",
        testTimeout: 10000
    }
});
