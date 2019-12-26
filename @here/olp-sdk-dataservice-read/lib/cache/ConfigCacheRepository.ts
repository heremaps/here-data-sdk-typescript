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

import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import { KeyValueCache } from "./KeyValueCache";

/**
 * Caches the catalog's configuration using a key-value pair.
 * The key format is `сatalog::${hrn}::${layerId}::${version}`.
 */
export class ConfigCacheRepository {
    /**
     * Generates the [[ConfigCacheRepository]] instance.
     * 
     * @param cache The [[KeyValueCache]] instance.
     * @return The [[ConfigCacheRepository]] instance.
     */
    constructor(private readonly cache: KeyValueCache) {}

    /**
     * Stores a key-value pair in the cache.
     * 
     * @param hrn The HERE Resource Name (HRN) of the catalog from which you want to get partitions metadata and data.
     * @param layerId The ID of the layer.
     * @param version The version of the layer.
     * @param catalog The catalog configuration to store in the cache
     * @return True if the operation is successful, false otherwise.
     */
    public put(
        hrn: string,
        layerId: string,
        version: number,
        catalog: ConfigApi.Catalog
    ): boolean {
        const key = this.createKey(hrn, layerId, version);
        return this.cache.put(key, JSON.stringify(catalog));
    }

    /**
     * Gets a catalog configuration from the cache.
     * 
     * @param hrn The HERE Resource Name (HRN) of the catalog from which you want to get partitions metadata and data.
     * @param layerId The ID of the layer.
     * @param version The version of the layer.
     * @return The catalog configuration, or undefined if the catalog configuration does not exist.
     */
    public get(
        hrn: string,
        layerId: string,
        version: number
    ): ConfigApi.Catalog | undefined {
        const key = this.createKey(hrn, layerId, version);
        const result = this.cache.get(key);
        return result ? JSON.parse(result) : result;
    }

    private createKey(
        hrn: string,
        layerId: string,
        version: number
    ): string {
        return `сatalog::${hrn}::${layerId}::${version}`;
    }
}
