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

import { LRUCache } from "./LRUCache";

/**
 * An in-memory caching instance.
 * 
 * All the repository instances use it for reading or caching information.
 */
export class KeyValueCache {
    private readonly cache: LRUCache<string, string>;
    /**
     * Cerates the `KeyValueCache` instance.
     *
     * @return The `KeyValueCache` instance.
     */
    constructor() {
        this.cache = new LRUCache();
    }

    /**
     * Stores a key-value pair in the cache.
     *
     * @param key The key for this value.
     * @param value The value of the string type.
     * @return True if the operation is successful; false otherwise.
     */
    public put(key: string, value: string): boolean {
        try {
            this.cache.set(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets a key-value pair from the cache.
     *
     * @param key The key for the requested value.
     * @return The value.
     */
    public get(key: string): string | undefined {
        return this.cache.get(key);
    }

    /**
     * Removes a key-value pair from the cache.
     *
     * @param key The key for the value that you want to remove from the cache.
     * @return True if the operation is successful; false otherwise.
     */
    public remove(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clears the cache and removes all stored key-value pairs.
     */
    public clear(): void {
        this.cache.clear();
    }

    /**
     * Resets the capacity of this cache.
     * 
     * If `newCapacity` is smaller than the current cache size,
     * all items are evicted until the cache shrinks to `newCapacity`.
     *
     * @param newCapacity The new capacity of this cache in MB.
     */
    public setCapacity(newCapacity: number): void {
        this.cache.setCapacity(newCapacity);
    }

    /**
     * The maximum capacity of the cache
     * that is the total amount of memory that can be consumed by the cache in MB.
     *
     * @returns The capacity of the cache.
     */
    public getCapacity(): number {
        return this.cache.getCapacity();
    }

    /**
     * The size of the cache
     * that is the sum of all the sizes of all the objects in the cache.
     *
     * @returns The size of the cache.
     */
    getSize(): number {
        return this.cache.getSize();
    }
}
