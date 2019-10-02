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

import { LRUCache, Entry } from "../lib/LRUCache";
import { assert } from "chai";

// helper class to access protected members of LRUCache
class TestLRUCache<Key, Value> extends LRUCache<Key, Value> {
    assertInternalIntegrity(entries: Key[]): void {
        // special case - empty cache
        if (entries.length === 0) {
            assert.strictEqual(this["m_map"].size, 0);
            assert.isNull(this["m_newest"]);
            assert.isNull(this["m_oldest"]);
            return;
        }

        // make sure the map has the correct size
        assert.strictEqual(this["m_map"].size, entries.length);

        assert.isNotNull(this["m_newest"]);
        // make sure that the first entry is the newest
        assert.strictEqual(
            (this["m_newest"] as Entry<Key, Value>).key,
            entries[0]
        );

        // now walk our linked list
        for (let i: number = 0; i < entries.length; ++i) {
            assert.isDefined(this["m_map"].get(entries[i]));

            const entry = this["m_map"].get(entries[i]) as Entry<Key, Value>;
            assert.strictEqual(entry.key, entries[i]);

            // special case first element
            if (i === 0) {
                assert.strictEqual(entry.newer, null);
            } else {
                assert.strictEqual(
                    (entry.newer as Entry<Key, Value>).key,
                    entries[i - 1]
                );
            }

            if (i === entries.length - 1) {
                assert.strictEqual(entry.older, null);
            } else {
                assert.strictEqual(
                    (entry.older as Entry<Key, Value>).key,
                    entries[i + 1]
                );
            }
        }

        // make sure the last entry is the oldest
        assert.isNotNull(this["m_oldest"]);
        assert.strictEqual(
            (this["m_oldest"] as Entry<Key, Value>).key,
            entries[entries.length - 1]
        );

        let currentSize = 0;
        this.map.forEach(val => (currentSize += val.size));
        assert.strictEqual(this["m_size"], currentSize);
    }
}

describe("LRUCache", () => {
    it("Should return undefined when the key is not present", function() {
        const cache = new LRUCache(3);

        assert.strictEqual(cache.get("test1"), undefined);
        assert.strictEqual(cache.get("test2"), undefined);
        assert.strictEqual(cache.get(3), undefined);
    });

    it("Supports get and set operations", function() {
        const cache = new LRUCache(3);
        cache.set("test1", 8);
        cache.set("test2", 27);
        cache.set(3, 11);

        assert.strictEqual(cache.get("test1"), 8);
        assert.strictEqual(cache.get("test2"), 27);
        assert.strictEqual(cache.get(3), 11);
    });

    it("Update operation is supported", function() {
        const cache = new LRUCache(3);
        cache.set(3, 11);
        cache.set(3, 33);
        assert.strictEqual(cache.get(3), 33);
    });

    it("Cache can be cleared", function() {
        const cache = new LRUCache(3);
        cache.set(1, [1, 2, 3, 4]);
        cache.set(2, 2);

        cache.clear();

        assert.strictEqual(cache.get(1), undefined);
        assert.strictEqual(cache.get(2), undefined);
    });

    it("New elements evict old elements when the cache is overflowed", function() {
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

    it("Test iteration over an empty cache", function() {
        const cache = new LRUCache(3);

        let i = 1;
        cache.forEach(() => {
            assert.fail();
            ++i;
        });
        assert.strictEqual(i, 1);
    });

    it("Test iteration over the cache", function() {
        const cache = new LRUCache(3);

        let i = 1;
        cache.set(3, 3);
        cache.set(2, 2);
        cache.set(1, 1);

        cache.forEach((key, value) => {
            assert.strictEqual(key, i);
            assert.strictEqual(value, i);
            ++i;
        });

        assert.strictEqual(i, 4);
    });

    it("Test internal integrity of the promoting the values in the cache", function() {
        const cache = new TestLRUCache<number, number>(3);
        cache.assertInternalIntegrity([]);

        cache.set(1, 1);
        cache.assertInternalIntegrity([1]);

        cache.set(2, 2);
        cache.assertInternalIntegrity([2, 1]);

        cache.set(3, 3);
        cache.assertInternalIntegrity([3, 2, 1]);

        // reorder the LRU cache
        assert.strictEqual(cache.get(3), 3);
        cache.assertInternalIntegrity([3, 2, 1]);

        assert.strictEqual(cache.get(2), 2);
        cache.assertInternalIntegrity([2, 3, 1]);

        assert.strictEqual(cache.get(1), 1);
        cache.assertInternalIntegrity([1, 2, 3]);

        cache.set(4, 4);
        cache.assertInternalIntegrity([4, 1, 2]);
        assert.strictEqual(cache.get(3), undefined);

        cache.set(5, 5);
        cache.assertInternalIntegrity([5, 4, 1]);
        assert.strictEqual(cache.get(2), undefined);
    });

    it("Delete operation is supported", function() {
        const cache = new LRUCache(4);

        cache.set(1, 1);
        cache.set(2, 2);
        cache.set(3, 3);
        cache.set(4, 4);

        assert.isTrue(cache.delete(2));

        assert.strictEqual(cache.get(1), 1);
        assert.strictEqual(cache.get(2), undefined);
        assert.strictEqual(cache.get(3), 3);
        assert.strictEqual(cache.get(4), 4);
    });

    it("Set operation is supported with custom cost function", function() {
        const cache = new TestLRUCache<number, number>(10, n => n);

        // fill cache, make sure size is correct
        cache.set(1, 1);
        cache.set(2, 8);
        assert.strictEqual(cache.size, 9);
        cache.assertInternalIntegrity([2, 1]);
    });

    it("Delete operation is supported with custom cost function", function() {
        const cache = new TestLRUCache<number, number>(10, n => n);

        // fill cache
        cache.set(1, 1);
        cache.set(2, 2);

        // delete all inserted items, make sure size is correct
        cache.delete(2);
        assert.strictEqual(cache.size, 1);
        cache.delete(1);
        assert.strictEqual(cache.size, 0);
        cache.assertInternalIntegrity([]);
    });

    it("New elements evict old elements when the cache is overflowed, supported with custom cost function", function() {
        const cache = new TestLRUCache<number, number>(10, n => n);

        // overflow cache
        cache.set(10, 10);
        assert.strictEqual(cache.size, 10);
        cache.set(1, 1);
        assert.strictEqual(cache.size, 1);
        cache.assertInternalIntegrity([1]);
    });

    it("Checks the internal integrity of delete operation", function() {
        const cache = new TestLRUCache(4);

        // delete the single entry (entry is both newest + oldest)
        cache.set(1, 1);
        assert.isTrue(cache.delete(1));
        assert.isUndefined(cache.get(1));
        cache.assertInternalIntegrity([]);

        // deleting it again should return false
        assert.isFalse(cache.delete(1));

        // now delete from the middle, from the end and from the front
        cache.set(4, 4);
        cache.set(3, 3);
        cache.set(2, 2);
        cache.set(1, 1);
        assert.isTrue(cache.delete(2));
        cache.assertInternalIntegrity([1, 3, 4]);

        assert.isTrue(cache.delete(4));
        cache.assertInternalIntegrity([1, 3]);

        assert.isTrue(cache.delete(1));
        cache.assertInternalIntegrity([3]);

        assert.isTrue(cache.delete(3));
        cache.assertInternalIntegrity([]);
    });

    it("Eviction callback is called for each evicted element", function() {
        let callCount: number = 0;
        let evictedKey: number;
        let evictedValue: number;

        const evictionCallback = (key: number, value: number) => {
            assert.strictEqual(key, evictedKey);
            assert.strictEqual(value, evictedValue);
            ++callCount;
        };

        const cache = new TestLRUCache<number, number>(2);
        cache.evictionCallback = evictionCallback;

        cache.set(1, 1);
        assert.strictEqual(callCount, 0);

        cache.set(2, 2);
        assert.strictEqual(callCount, 0);

        evictedKey = evictedValue = 1;
        cache.set(3, 3);
        assert.strictEqual(callCount, 1);

        evictedKey = evictedValue = 2;
        cache.set(4, 4);
        assert.strictEqual(callCount, 2);

        // update a value, no callback should be fired
        evictedKey = evictedValue = -1;
        cache.set(4, 5);
        assert.strictEqual(callCount, 2);
    });

    it("Resetting the capacity evicts elements", function() {
        const cache = new TestLRUCache<number, number>(2);

        cache.set(1, 1);
        cache.set(2, 2);

        assert.strictEqual(cache.size, 2);
        assert.strictEqual(cache.capacity, 2);

        cache.setCapacity(1);
        assert.strictEqual(cache.capacity, 1);
        assert.strictEqual(cache.size, 1);

        assert.isFalse(cache.has(1));
        assert.isTrue(cache.has(2));

        cache.setCapacity(2);
        cache.set(1, 1);

        assert.strictEqual(cache.capacity, 2);
        assert.strictEqual(cache.size, 2);
        assert.isTrue(cache.has(1));
        assert.isTrue(cache.has(2));
    });

    it("Shrink to capacity size operation is supported with a custom cost function", function() {
        const cache = new TestLRUCache<number, { size: number }>(
            10,
            n => n.size
        );

        const obj1 = {
            size: 1
        };
        const obj2 = {
            size: 2
        };
        // fill cache, make sure size is correct
        cache.set(1, obj1);
        cache.set(2, obj2);
        assert.strictEqual(cache.size, 3);
        cache.assertInternalIntegrity([2, 1]);

        // check capacity, nothing should change
        cache.shrinkToCapacity();
        assert.strictEqual(cache.size, 3);
        cache.assertInternalIntegrity([2, 1]);

        obj2.size = 10;
        // check capacity again after obj2 size is changed
        cache.shrinkToCapacity();
        assert.strictEqual(cache.size, 10);
        cache.assertInternalIntegrity([2]);
    });

    it("Shrink to empty capacity size is supported with a custom cost function", function() {
        const cache = new TestLRUCache<number, { size: number }>(
            10,
            n => n.size
        );

        // check capacity, nothing should change
        cache.shrinkToCapacity();
        assert.strictEqual(cache.size, 0);
    });
});
