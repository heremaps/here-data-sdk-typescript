import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/integration/api-breaks/*.test.ts"],
        environment: "node",
        testTimeout: 10000
    }
});
