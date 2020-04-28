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

import { getDataSize } from "../utils";
/**
 * Method to assert if flow is not broken.
 * @param condition boolean. Throw error if false
 */
function assert(condition: boolean): void {
    if (!condition) {
        throw new Error("ASSERTION failed");
    }
}

/** @hidden */
export class Entry<Key, Value> {
    constructor(
        public key: Key,
        public value: Value,
        public size: number,
        public newer: Entry<Key, Value> | null,
        public older: Entry<Key, Value> | null
    ) {}
}

const BYTES_IN_MB = 1048576;

/**
 * Fixed size cache that evicts its entries in least-recently-used order when it overflows.
 * Modeled after standard JavaScript `Map` otherwise.
 */
export class LRUCache<Key, Value> {
    private cacheSize = 0;
    private maxCapacity: number;

    /**
     * The internal map object that keeps the key-value pairs and their order.
     */
    private cache = new Map<Key, Entry<Key, Value>>();

    /**
     * The newest entry, i.e. the most recently used item.
     */
    private newestEntry: Entry<Key, Value> | null = null;

    /**
     * The oldest entry, i.e. the least recently used item.
     */
    private oldestEntry: Entry<Key, Value> | null = null;

    /**
     * Creates a new instance of `LRUCache`.
     *
     * [[capacity]] means then memory used (in MBs).
     *
     * @param capacity Number used to configure the maximum cache size in MB.
     */
    constructor(capacity: number = 2) {
        this.maxCapacity = capacity * BYTES_IN_MB;
    }

    /**
     * Iterates over all items from the most recently used item to the least recently used one.
     *
     * **Note**: Results are undefined if the entire cache is modified during iteration. You may
     * although modify the current element in [[callbackfn]] function.
     *
     * @param callbackfn The callback to call for each item.
     * @param thisArg Optional this argument for the callback.
     */
    forEach(
        callbackfn: (value: Value, key: Key, map: LRUCache<Key, Value>) => void,
        thisArg?: any
    ): void {
        let entry = this.newestEntry;
        while (entry !== null) {
            const older = entry.older;
            callbackfn.call(thisArg, entry.value, entry.key, this);
            entry = older;
        }
    }

    /**
     * The size of the cache, i.e. the sum of all the sizes of all the objects in the cache.
     *
     * @returns The size of the cache.
     */
    getSize(): number {
        return this.cacheSize;
    }

    /**
     * Returns the maximum capacity of the cache, i.e.
     * the total amount of memory that may be consumed by cache in MB
     *
     * @returns The capacity of the cache.
     */
    getCapacity(): number {
        return this.maxCapacity;
    }

    /**
     * Returns the newest entry in the cache.
     *
     * @returns Newest entry in the cache.
     */
    getNewest(): Entry<Key, Value> | null {
        return this.newestEntry;
    }

    /**
     * Returns the oldest entry in the cache.
     *
     * Note: Does not promote the oldest item as most recently used item.
     *
     * @returns Oldest entry in the cache.
     */
    getOldest(): Entry<Key, Value> | null {
        return this.oldestEntry;
    }

    /**
     * Resets the capacity of this cache. If `newCapacity` is smaller than the current cache size,
     * all items will be evicted until the cache shrinks to `newCapacity`.
     *
     * @param newCapacity The new capacity of this cache in MB.
     */
    setCapacity(newCapacity: number): void {
        this.maxCapacity = newCapacity * BYTES_IN_MB;
        this.evict();
    }

    /**
     * Inserts or updates a key/value pair in the cache.
     *
     * If the key already existed in the cache, it will be updated and promoted to the most recently
     * used item.
     *
     * If the key didn't exist in the cache, it will be inserted as most recently used item. An
     * eviction of the least recently used item takes place if the cache exceeded its capacity.
     *
     * Throw error if value size is bigger than cache size. When call this method wrap it in the try/catch block.
     *
     * @param key The key for the key-value pair to insert or update.
     * @param value The value for the key-value pair to insert or update.
     */
    set(key: Key, value: Value) {
        const valueSize = getDataSize(value);
        let entry = this.cache.get(key);
        if (entry !== undefined) {
            this.cacheSize = this.cacheSize - entry.size + valueSize;
            entry.value = value;
            entry.size = valueSize;
            this.promoteEntry(entry);
            this.evict();
        } else {
            if (valueSize > this.maxCapacity) {
                throw new Error(
                    "Error. Value size is to big for cache it. Raise cache capacity, please."
                );
            }

            entry = new Entry<Key, Value>(key, value, valueSize, null, null);
            if (this.cache.size === 0) {
                this.newestEntry = this.oldestEntry = entry;
            } else {
                if (this.newestEntry !== null) {
                    const newest: Entry<Key, Value> = this.newestEntry;
                    entry.older = this.newestEntry;
                    newest.newer = entry;
                    this.newestEntry = entry;
                } else {
                    assert(false);
                }
            }
            this.cache.set(key, entry);
            this.cacheSize += valueSize;
            this.evict();
        }
    }

    /**
     * Looks up key in the cache and returns the associated value.
     *
     * @param key The key to look up.
     * @returns The associated value, or `undefined` if the key-value pair is not in the cache.
     */
    get(key: Key): Value | undefined {
        const entry = this.cache.get(key);
        if (entry === undefined) {
            return undefined;
        }

        this.promoteEntry(entry);
        return entry.value;
    }

    /**
     * Test if a key/value pair is in the cache.
     *
     * @param key The key to look up.
     * @returns `true` if the key-value pair is in the cache, `false` otherwise.
     */
    has(key: Key): boolean {
        return this.cache.has(key);
    }

    /**
     * Clears the cache and removes all stored key-value pairs.
     */
    clear(): void {
        this.newestEntry = this.oldestEntry = null;
        this.cacheSize = 0;
        this.cache.clear();
    }

    /**
     * Explicitly removes a key-value pair from the cache.
     *
     * **Note**: This is an explicit removal, thus, the eviction callback will not be called.
     *
     * @param key The key of the key-value pair to delete.
     * @returns `true` if the key-value pair existed and was deleted, `false` otherwise.
     */
    delete(key: Key): boolean {
        const entry = this.cache.get(key);
        if (entry === undefined) {
            return false;
        }
        this.deleteEntry(entry);
        return this.cache.delete(key);
    }

    protected evict() {
        while (this.oldestEntry !== null && this.cacheSize > this.maxCapacity) {
            const evicted = this.evictOldest();
            if (evicted === undefined) {
                return;
            }
        }
    }

    protected evictOldest(): Entry<Key, Value> | undefined {
        if (this.oldestEntry !== null) {
            const itemToRemove = this.oldestEntry;
            assert(itemToRemove.older === null);

            this.oldestEntry = itemToRemove.newer;
            if (itemToRemove.newer !== null) {
                assert(itemToRemove.newer.older === itemToRemove);
                itemToRemove.newer.older = null;
            }

            const isOk = this.cache.delete(itemToRemove.key);
            assert(isOk === true);

            this.cacheSize -= itemToRemove.size;
            return itemToRemove;
        } else {
            assert(false);
            return;
        }
    }

    private deleteEntry(entry: Entry<Key, Value>): void {
        if (entry === this.newestEntry) {
            this.newestEntry = entry.older;
        } else if (entry.newer) {
            entry.newer.older = entry.older;
        } else {
            assert(false);
        }

        if (entry === this.oldestEntry) {
            this.oldestEntry = entry.newer;
        } else if (entry.older) {
            entry.older.newer = entry.newer;
        } else {
            assert(false);
        }

        this.cacheSize -= entry.size;
    }

    private promoteEntry(entry: Entry<Key, Value>): void {
        if (entry === this.newestEntry) {
            return;
        } // already newest, nothing to do

        // re-link newer and older items
        if (entry.newer) {
            assert(entry.newer.older === entry);
            entry.newer.older = entry.older;
        }
        if (entry.older) {
            assert(entry.older.newer === entry);
            entry.older.newer = entry.newer;
        }
        if (entry === this.oldestEntry) {
            this.oldestEntry = entry.newer;
        }
        // re-link ourselves
        entry.newer = null;
        entry.older = this.newestEntry;

        // finally, set ourselves as the newest entry
        if (this.newestEntry !== null) {
            const newest = this.newestEntry;
            assert(newest.newer === null);
            newest.newer = entry;
            this.newestEntry = entry;
        } else {
            assert(false);
        }
    }
}
