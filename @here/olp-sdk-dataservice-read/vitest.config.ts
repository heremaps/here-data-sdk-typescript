import { defineConfig } from "vitest/config";
import { coverageReporters, hereAliases } from "../../vitest.shared";

export default defineConfig({
    resolve: {
        alias: hereAliases,
        // Prefer TypeScript sources over the compiled `.js` that sit next to them
        // so the aliased packages resolve to a single, consistent source graph.
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
