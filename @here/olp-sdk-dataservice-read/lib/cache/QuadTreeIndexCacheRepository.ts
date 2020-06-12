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

import { KeyValueCache, TileKey } from "@here/olp-sdk-core";
import { Index as QuadTreeIndex } from "@here/olp-sdk-dataservice-api/lib/query-api";

interface QuadTreeIndexCacheParams {
    hrn: string;
    layerId: string;
    root: TileKey;
    depth: number;
    version?: number;
}

/**
 * Caches the QuadTreeIndex using a key-value pair.
 */
export class QuadTreeIndexCacheRepository {
    /**
     * Generates the [[QuadTreeIndexCacheRepository]] instance.
     *
     * @param cache The [[KeyValueCache]] instance.
     * @return The [[QuadTreeIndexCacheRepository]] instance.
     */
    constructor(private readonly cache: KeyValueCache) {}

    /**
     * Stores a key-value pair in the cache.
     *
     * @return True if the operation is successful, false otherwise.
     */
    public put(
        params: QuadTreeIndexCacheParams & { tree: QuadTreeIndex }
    ): boolean {
        return this.cache.put(
            this.createKey(params),
            JSON.stringify(params.tree)
        );
    }

    /**
     * Gets a QuadTreeIndex from the cache.
     *
     * @param params [[QuadTreeIndexCacheParams]] object.
     * @return The QuadTreeIndex for the Tile, or undefined if the QuadTreeIndex does not exist.
     */
    public get(params: QuadTreeIndexCacheParams): QuadTreeIndex | undefined {
        const key = this.createKey(params);
        const serializedTree = this.cache.get(key);
        return serializedTree ? JSON.parse(serializedTree) : undefined;
    }

    private createKey(params: QuadTreeIndexCacheParams): string {
        const version =
            params.version !== undefined ? `::${params.version}` : "";
        return `${params.hrn}::${
            params.layerId
        }::${params.root.toHereTile()}${version}::${params.depth}::quadtree`;
    }
}
