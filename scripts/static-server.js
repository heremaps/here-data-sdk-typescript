/*
 * Copyright (C) 2019-2026 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

// Minimal zero-dependency static file server used to serve the bundle-testing
// toolkit page for the puppeteer UMD bundle tests. Replaces the `serve` npm
// package to keep the dev dependency surface small.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || ".");
const port = Number(process.argv[3]) || 8080;

const CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json; charset=utf-8"
};

const server = http.createServer((req, res) => {
    const requestPath = decodeURIComponent(req.url.split("?")[0]);
    const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = path.join(root, relativePath);

    // Prevent path traversal outside of the served root.
    if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }
        const type = CONTENT_TYPES[path.extname(filePath)] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
});

server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Static server running at http://localhost:${port} (root: ${root})`);
});
