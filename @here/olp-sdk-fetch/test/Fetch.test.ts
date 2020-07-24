/*
 * Copyright (C) 2019 HERE Europe B.V.
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

import { assert } from "chai";
import * as path from "path";
import "../index";

const isNode = typeof window === "undefined";
const describeOnlyNode = isNode ? describe : xdescribe;

describe("@here/harp-fetch", function() {
    it("fetch", function() {
        assert.isFunction(fetch);
    });

    it("headers", function() {
        const headers = new Headers();
        headers.append("testName", "testValue");

        assert.strictEqual(headers.get("testName"), "testValue");
    });

    it("AbortController", function() {
        const abortController = new AbortController();
        const signal = abortController.signal;
        assert.isFalse(signal.aborted);
    });

    describeOnlyNode("global.fetch file support (node.js)", function() {
        function getRelativeResourcePath(filePath: string) {
            return path.relative(
                process.cwd(),
                path.resolve(__dirname, filePath)
            );
        }

        it("loads binaries", async function() {
            const testPath = getRelativeResourcePath("resources/test.bin");
            const response = await fetch(testPath);
            assert(response.ok);
            const bufferResult = await response.arrayBuffer();
            assert(bufferResult);
            assert.equal(bufferResult.byteLength, 4);
            const resultBytes = new Uint8Array(bufferResult);
            assert.equal(resultBytes[0], 1);
            assert.equal(resultBytes[1], 2);
            assert.equal(resultBytes[2], 3);
            assert.equal(resultBytes[3], 4);
        });
        it("loads json", async function() {
            const testPath = getRelativeResourcePath("resources/test.json");
            const response = await fetch(testPath);
            assert(response.ok);
            const jsonFromFile = await response.json();
            assert(jsonFromFile);
            assert.equal(jsonFromFile.message, "Test message");
        });
    });
});
