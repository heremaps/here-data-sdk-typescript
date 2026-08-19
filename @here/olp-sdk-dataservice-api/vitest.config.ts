import * as path from "path";
import { defineConfig } from "vitest/config";
import { coverageReporters } from "../../vitest.shared";

export default defineConfig({
    resolve: {
        // Most tests reach the API namespaces through this package's own public
        // barrel, so the barrel has to resolve to the TypeScript sources.
        // Aliasing here is safe because these tests never spy on the exported
        // namespaces - unlike the higher-level packages, which deliberately
        // keep `olp-sdk-dataservice-api` compiled for that reason.
        alias: [
            {
                find: /^@here\/olp-sdk-dataservice-api$/,
                replacement: path.join(__dirname, "index.ts")
            }
        ],
        // Prefer TypeScript sources over the compiled `.js` that `npm run build`
        // leaves next to them, so `coverage.include` actually matches the files
        // the tests exercise.
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
