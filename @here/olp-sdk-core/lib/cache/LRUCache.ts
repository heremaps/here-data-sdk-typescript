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

/**
 * Fixed size cache that evicts its entries in least-recently-used order when it overflows.
 * Modeled after standard JavaScript `Map` otherwise.
 */
export class LRUCache<Key, Value> {
    private cacheSize = 0;

    /**
     * The internal map object that keeps the key-value pairs and their order.
     */
    private map = new Map<Key, Entry<Key, Value>>();

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
     * The optional [[sizeFunction]] can be used to fine tune the memory consumption of all cached
     * elements, thus [[cacheCapacity]] means then memory used. Otherwise, if
     * [[sizeFunction]] is not specified, the [[cacheCapacity]] accounts for the maximum
     * number of elements stored.
     *
     * @param cacheCapacity Number used to configure the maximum cache size, may express
     * number of entries or memory consumed in bytes/megabytes depending on [[sizeFunction]].
     * @param sizeFunction A function determining the size per element.
     */
    constructor(
        private maxCapacity: number,
        private sizeFunction: (v: Value) => number = () => 1
    ) {}

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
     * @param newCapacity The new capacity of this cache.
     */
    setCapacity(newCapacity: number): void {
        this.maxCapacity = newCapacity;
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
     * @param key The key for the key-value pair to insert or update.
     * @param value The value for the key-value pair to insert or update.
     * @throws An error if value size is bigger than cache size.
     */
    set(key: Key, value: Value) {
        const valueSize = this.sizeFunction(value);
        let entry = this.map.get(key);
        if (entry !== undefined) {
            this.cacheSize = this.cacheSize - entry.size + valueSize;
            entry.value = value;
            entry.size = valueSize;
            this.promoteEntry(entry);
            this.evict();
        } else {
            if (valueSize > this.maxCapacity) {
                throw new Error(
                    `Error. Value size (${valueSize}) is to big for cache it (${this.maxCapacity}).`
                );
            }

            entry = new Entry<Key, Value>(key, value, valueSize, null, null);

            if (this.map.size === 0) {
                this.newestEntry = this.oldestEntry = entry;
            } else {
                if (this.newestEntry !== null) {
                    const newest = this.newestEntry;

                    entry.older = this.newestEntry;
                    newest.newer = entry;

                    this.newestEntry = entry;
                }
            }

            this.map.set(key, entry);

            this.cacheSize += valueSize;

            this.evict();
        }
    }

    /**
     * Test if a key/value pair is in the cache.
     *
     * @param key The key to look up.
     * @returns `true` if the key-value pair is in the cache, `false` otherwise.
     */
    has(key: Key): boolean {
        return this.map.has(key);
    }

    /**
     * Looks up key in the cache and returns the associated value.
     *
     * @param key The key to look up.
     * @returns The associated value, or `undefined` if the key-value pair is not in the cache.
     */
    get(key: Key): Value | undefined {
        const entry = this.map.get(key);
        if (entry === undefined) {
            return undefined;
        }

        this.promoteEntry(entry);
        return entry.value;
    }
 
    /**
     * @returns List of all the keys stored in the cache
     */
    getAllKeys(): MapIterator<Key> {
        return this.map.keys()
    }

    /**
     * Clears the cache and removes all stored key-value pairs.
     */
    clear(): void {
        this.newestEntry = this.oldestEntry = null;
        this.cacheSize = 0;
        this.map.clear();
    }

    /**
     * Explicitly removes a key-value pair from the cache.
     *
     * @note: This is an explicit removal, thus, the eviction callback will not be called.
     *
     * @param key The key of the key-value pair to delete.
     * @returns `true` if the key-value pair existed and was deleted, `false` otherwise.
     */
    delete(key: Key): boolean {
        const entry = this.map.get(key);
        if (entry === undefined) {
            return false;
        }
        this.deleteEntry(entry);
        return this.map.delete(key);
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

            this.oldestEntry = itemToRemove.newer;
            if (itemToRemove.newer !== null) {
                itemToRemove.newer.older = null;
            }

            this.map.delete(itemToRemove.key);

            this.cacheSize -= itemToRemove.size;
            return itemToRemove;
        } else {
            return;
        }
    }

    protected promoteEntry(entry: Entry<Key, Value>): void {
        if (entry === this.newestEntry) {
            return;
        } // already newest, nothing to do

        // re-link newer and older items
        if (entry.newer) {
            entry.newer.older = entry.older;
        }
        if (entry.older) {
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
            newest.newer = entry;
            this.newestEntry = entry;
        }
    }

    private deleteEntry(entry: Entry<Key, Value>): void {
        if (entry === this.newestEntry) {
            this.newestEntry = entry.older;
        } else if (entry.newer) {
            entry.newer.older = entry.older;
        }

        if (entry === this.oldestEntry) {
            this.oldestEntry = entry.newer;
        } else if (entry.older) {
            entry.older.newer = entry.newer;
        }

        this.cacheSize -= entry.size;
    }
}
