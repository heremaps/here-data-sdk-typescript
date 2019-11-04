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

/**
 * Class for cache expecting a key,value pair.
 */
export class KeyValueCache {
    private readonly cache: Map<string, string>;
    constructor() {
        this.cache = new Map();
    }

    /**
     * Store key,value pair into the cache
     *
     * @param key Key for this value
     * @param value The value of string type
     * @return Returns true if the operation is successfull, false otherwise.
     */
    public put(key: string, value: string): boolean {
        return this.cache.set(key, value).has(key);
    }

    /**
     * Get key,value pair from the cache
     *
     * @param key Key to look for
     */
    public get(key: string): string | undefined {
        return this.cache.get(key);
    }

    /**
     * Remove a key,value pair from the cache
     *
     * @param key Key for the value to remove from cache
     *
     * @return Returns true if the operation is successfull, false otherwise.
     */
    public remove(key: string): boolean {
        return this.cache.delete(key);
    }
}
