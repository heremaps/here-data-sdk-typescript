/*
 * Copyright (C) 2020 HERE Europe B.V.
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
import { LRUCache } from "@here/olp-sdk-core";

describe("LRU", () => {
    it("set", () => {
        const cache = new LRUCache(3);
        cache.set(1, 1);
        cache.set(2, 2);
        cache.set(3, 3);

        assert.strictEqual(cache.get(1), 1);
        assert.strictEqual(cache.get(2), 2);
        assert.strictEqual(cache.get(3), 3);
    });

    it("get", () => {
        const cache = new LRUCache<number, number>(3);
        assert.strictEqual(cache.get(1), undefined);
        assert.strictEqual(cache.get(2), undefined);
        cache.set(1, 1);
        cache.set(2, 2);
        assert.strictEqual(cache.get(1), 1);
        assert.strictEqual(cache.get(2), 2);
        assert.strictEqual(cache.get(0), undefined);
        assert.strictEqual(cache.get(3), undefined);
    });

    it("overflow", () => {
        const cache = new LRUCache(3);
        cache.set(1, 1);
        cache.set(2, 2);
        cache.set(3, 3);
        cache.set(4, 4);

        assert.strictEqual(cache.get(1), undefined);
        assert.strictEqual(cache.get(2), 2);
        assert.strictEqual(cache.get(3), 3);
        assert.strictEqual(cache.get(4), 4);
    });

    it("clear", () => {
        const cache = new LRUCache(3);
        cache.set(1, 1);
        cache.set(2, 2);
        cache.clear();

        assert.strictEqual(cache.get(1), undefined);
        assert.strictEqual(cache.get(2), undefined);
    });

    it("resize", () => {
        const cache = new LRUCache<number, number>(2);

        cache.set(1, 1);
        cache.set(2, 2);

        assert.strictEqual(cache.getSize(), 2);
        assert.strictEqual(cache.getCapacity(), 2);

        cache.setCapacity(1);
        assert.strictEqual(cache.getCapacity(), 1);
        assert.strictEqual(cache.getSize(), 1);

        assert.isFalse(cache.has(1));
        assert.isTrue(cache.has(2));

        cache.setCapacity(2);
        cache.set(1, 1);

        assert.strictEqual(cache.getCapacity(), 2);
        assert.strictEqual(cache.getSize(), 2);
        assert.isTrue(cache.has(1));
        assert.isTrue(cache.has(2));
    });
});
