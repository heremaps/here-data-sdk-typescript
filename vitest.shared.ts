import * as path from "path";
import type { CoverageOptions } from "vitest/node";

// Absolute path to the monorepo root (this file lives at the root).
const root = __dirname;

// Only the higher-level packages are aliased to their TypeScript sources. The
// low-level `olp-sdk-fetch` and `olp-sdk-dataservice-api` are intentionally left
// as compiled output so their exported namespaces (e.g. `BlobApi`, `MetadataApi`)
// keep writable members that `vi.spyOn` can replace.
const packages = [
    "olp-sdk-core",
    "olp-sdk-authentication",
    "olp-sdk-dataservice-read",
    "olp-sdk-dataservice-write"
];

// Resolve every `@here/*` import (including deep `@here/*/lib/...` paths) to the
// package TypeScript sources instead of the compiled output. This gives Vitest a
// single, consistent module graph so module mocking, spying and self-referential
// barrel imports behave predictably.
export const hereAliases = [
    ...packages.map((name) => ({
        find: new RegExp(`^@here/${name}/(.*)`),
        replacement: path.join(root, "@here", name, "$1")
    })),
    ...packages.map((name) => ({
        find: new RegExp(`^@here/${name}$`),
        replacement: path.join(root, "@here", name, "index.ts")
    }))
];

// Every package writes its own report, and Codecov merges them by file path.
// Package relative paths collide - all six packages have an `index.ts`, and
// both dataservice packages have a `lib/client/VersionedLayerClient.ts` - so
// the lcov paths are written relative to the monorepo root instead.
export const coverageReporters: CoverageOptions["reporter"] = [
    "text",
    "html",
    ["lcov", { projectRoot: root }]
];
