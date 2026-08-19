import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/integration/bundles/umd/olp-sdk-generated.test.ts"],
        environment: "node",
        testTimeout: 30000,
        hookTimeout: 30000
    }
});
