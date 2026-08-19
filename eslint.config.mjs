// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    {
        // Only the published TypeScript sources are linted. Tests, generated
        // declaration files, compiled bundles, examples and docs are excluded,
        // mirroring the previous TSLint `linterOptions.exclude` configuration.
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/*.js",
            "**/*.mjs",
            "**/*.d.ts",
            "**/test/**",
            "tests/**",
            "examples/**",
            "docs/**"
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        files: ["@here/**/*.ts"],
        rules: {
            // The SDK sources predate strict typescript-eslint defaults; relax
            // the rules that would otherwise flood the migration with churn
            // while keeping the genuinely useful checks as errors.
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-this-alias": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-require-imports": "off",
            // Rules not enforced by the previous TSLint configuration; keep the
            // existing code patterns (e.g. `cb && cb()` short-circuit calls,
            // `obj.hasOwnProperty(...)`) working without churn.
            "@typescript-eslint/no-unused-expressions": "off",
            "no-prototype-builtins": "off",
            "no-case-declarations": "off",
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
            ]
        }
    }
);
