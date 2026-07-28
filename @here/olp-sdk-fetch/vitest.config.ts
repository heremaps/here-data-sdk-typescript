import { defineConfig } from "vitest/config";
import { coverageReporters } from "../../vitest.shared";

export default defineConfig({
    resolve: {
        // Prefer TypeScript sources over the compiled `.js` that `npm run build`
        // leaves next to them. Without this the tests exercise the compiled
        // output while `coverage.include` points at `.ts`, so the package
        // reports no coverage at all.
        extensions: [".ts", ".mjs", ".js", ".mts", ".json"]
    },
    test: {
        include: ["test/**/*.test.ts"],
        environment: "node",
        coverage: {
            provider: "v8",
            include: ["lib/**/*.ts", "index*.ts"],
            reporter: coverageReporters
        }
    }
});
