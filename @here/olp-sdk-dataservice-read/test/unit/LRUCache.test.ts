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
import { Entry, LRUCache, getDataSize } from "../../lib";

// tslint:disable:no-string-literal
// tslint:disable:only-arrow-functions
//    Mocha discourages using arrow functions, see https://mochajs.org/#arrow-functions

// helper class to access protected members of LRUCache
class TestLRUCache<Key, Value> extends LRUCache<Key, Value> {
    assertInternalIntegrity(entries: Key[]): void {
        // special case - empty cache
        if (entries.length === 0) {
            assert.strictEqual(this["cache"].size, 0);
            assert.isNull(this["newestEntry"]);
            assert.isNull(this["oldestEntry"]);
            return;
        }

        // make sure the map has the correct size
        assert.strictEqual(this["cache"].size, entries.length);

        assert.isNotNull(this["newestEntry"]);
        // make sure that the first entry is the newest
        assert.strictEqual(
            (this["newestEntry"] as Entry<Key, Value>).key,
            entries[0]
        );

        // now walk our linked list
        for (let i: number = 0; i < entries.length; ++i) {
            assert.isDefined(this["cache"].get(entries[i]));

            const entry = this["cache"].get(entries[i]) as Entry<Key, Value>;
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
        assert.isNotNull(this["oldestEntry"]);
        assert.strictEqual(
            (this["oldestEntry"] as Entry<Key, Value>).key,
            entries[entries.length - 1]
        );
    }
}

describe("LRUCache", function() {
    it("set", function() {
        const cache = new LRUCache(3);
        cache.set(1, 1);
        cache.set(2, 2);
        cache.set(3, 3);

        assert.strictEqual(cache.get(1), 1);
        assert.strictEqual(cache.get(2), 2);
        assert.strictEqual(cache.get(3), 3);
        const newest = cache.getNewest();
        const oldest = cache.getOldest();
        assert.equal(newest && newest.value, 3);
        assert.equal(newest && newest.newer, null);
        assert.equal(oldest && oldest.value, 1);
        assert.equal(oldest && oldest.older, null);

        cache.clear();
        cache.set(3, 3);
        cache.set(3, "some message");
        const size = getDataSize("some message");
        assert.equal(cache.getSize(), size);
    });

    it("get", function() {
        const cache = new LRUCache<number, number>(3);
        assert.strictEqual(cache.get(1), undefined);
        assert.strictEqual(cache.get(2), undefined);
        cache.set(1, 1);
        cache.set(2, 2);
        assert.strictEqual(cache.get(1), 1);
        assert.strictEqual(cache.get(2), 2);
        assert.strictEqual(cache.get(0), undefined);
        assert.strictEqual(cache.getSize(), 16);
        assert.strictEqual(cache.getCapacity(), 3145728);
        assert.strictEqual(cache.has(1), true);
    });

    it("internalIntegrity", function() {
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
        cache.assertInternalIntegrity([4, 1, 2, 3]);
        assert.strictEqual(cache.get(3), 3);
        assert.strictEqual(cache.get(6), undefined);
    });

    it("overflow", function() {
        const cache = new LRUCache(0.0001);
        const mockData = {
            a: "test",
            b: 42,
            c: [1, 2, 3, 4, 56, 6],
            d: "^#%FEVTVJF"
        };
        cache.set(1, 1);
        cache.set(2, 2);
        cache.set(3, 3);
        cache.set(4, mockData);

        assert.strictEqual(cache.get(1), undefined);
        assert.strictEqual(cache.get(2), 2);
        assert.strictEqual(cache.get(3), 3);
        assert.strictEqual(cache.get(4), mockData);
    });

    it("clear", function() {
        const cache = new LRUCache(3);
        cache.set(1, 1);
        cache.set(2, 2);
        cache.clear();

        assert.strictEqual(cache.get(1), undefined);
        assert.strictEqual(cache.get(2), undefined);
    });

    it("iterate", function() {
        const cache = new LRUCache(3);

        // iterate over empty array, callback must never be called.
        let i = 1;
        cache.forEach(() => {
            assert.fail();
            ++i;
        });
        assert.strictEqual(i, 1);

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

    it("delete", function() {
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

    it("resize", function() {
        const cache = new TestLRUCache<number, number>(2);

        cache.set(1, 1);
        cache.set(2, 2);

        assert.strictEqual(cache.getSize(), 16);
        assert.strictEqual(cache.getCapacity(), 2097152);

        cache.setCapacity(0.00001);
        assert.strictEqual(cache.getCapacity(), 10.48576);
        assert.strictEqual(cache.getSize(), 8);

        assert.isFalse(cache.has(1));
        assert.isTrue(cache.has(2));

        cache.setCapacity(2);
        cache.set(1, 1);

        assert.strictEqual(cache.getCapacity(), 2097152);
        assert.strictEqual(cache.getSize(), 16);
        assert.isTrue(cache.has(1));
        assert.isTrue(cache.has(2));

        cache.clear();
        cache.setCapacity(0.0000001);
        try {
            cache.set(1, 42);
        } catch (error) {
            assert.equal(
                error.message,
                "Error. Value size is to big for cache it. Raise cache capacity, please."
            );
        }
    });

    it("customCost", function() {
        const cache = new TestLRUCache<number, number>(10);

        // fill cache, make sure size is correct
        cache.set(1, 1);
        cache.set(2, 2);
        assert.strictEqual(cache.getSize(), 16);
        cache.assertInternalIntegrity([2, 1]);

        // delete all inserted items, make sure size is correct
        cache.delete(2);
        assert.strictEqual(cache.getSize(), 8);
        cache.delete(1);
        assert.strictEqual(cache.getSize(), 0);
        cache.assertInternalIntegrity([]);

        // overflow cache
        cache.set(10, 10);
        assert.strictEqual(cache.getSize(), 8);
        cache.set(1, 1);
        assert.strictEqual(cache.getSize(), 16);
        cache.assertInternalIntegrity([1, 10]);

        // too big to insert, should do nothing
        try {
            cache.set(12, 12);
        } catch (err) {
            assert.equal(
                err.message,
                "Error. Value size is to big for cache it. Raise cache capacity, please."
            );
        }
        cache.assertInternalIntegrity([12, 1, 10]);

        // adding a large item should evict all older ones
        cache.clear();
        cache.set(4, 4);
        cache.set(5, 5);
        cache.set(9, 9);
        cache.assertInternalIntegrity([9, 5, 4]);
    });
});
