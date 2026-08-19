import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/functional/*.test.ts"],
        environment: "node",
        testTimeout: 10000,
        // The hooks boot and stop a JVM, and mockserver-node polls for
        // readiness for about 11 seconds before it gives up. The 10 second
        // default always cuts that short and reports a timeout instead of
        // the error that mockserver-node is about to raise.
        hookTimeout: 30000
    }
});
