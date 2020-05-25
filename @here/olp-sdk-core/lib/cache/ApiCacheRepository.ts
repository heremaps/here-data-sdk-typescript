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

import { HRN, KeyValueCache } from "@here/olp-sdk-core";

/**
 * The list of the API endpoints names that the HERE Data SDK for TypeScript uses.
 */
export type ApiName =
    | "config"
    | "artifact"
    | "blob"
    | "index"
    | "ingest"
    | "metadata"
    | "notification"
    | "publish"
    | "query"
    | "statistics"
    | "stream"
    | "volatile-blob";

/**
 * The list of the types could be saved in the cache.
 */
export type CacheType = "api" | "age";

/**
 * Caches the base URLs of the API using a key-value pair.
 * The key format is `<hrn>::<service_name>::<serviceVersion>::api`.
 */
export class ApiCacheRepository {
    private readonly hrn: string;

    /**
     * Generates the [[ApiCacheRepository]] instance.
     *
     * @param cache The [[KeyValueCache]] instance.
     * @param hrn The HERE Resource Name (HRN) for which you want to use the [[ApiCacheRepository]] instance.
     * @return The [[ApiCacheRepository]] instance.
     */
    constructor(private readonly cache: KeyValueCache, hrn?: HRN) {
        this.hrn = hrn ? hrn.toString() : "platform-api";
    }

    /**
     * Stores a key-value pair in the cache.
     *
     * @param service The name of the API service for which you need the key-value pair.
     * @param serviceVersion The version of the service.
     * @param serviceUrl The base URL of the service.
     * @return True if the operation is successful, false otherwise.
     */
    public put(
        service: ApiName,
        serviceVersion: string,
        serviceUrl: string,
        type: CacheType
    ): boolean {
        const key = this.createKey(this.hrn, service, serviceVersion, type);
        return this.cache.put(key, serviceUrl);
    }

    /**
     * Gets a base URL from the cache.
     *
     * @param service The name of the API service for which you want to get the base URL.
     * @param serviceVersion The service version.
     * @return The base URL of the service, or undefined if the base URL does not exist.
     */
    public get(
        service: string,
        serviceVersion: string,
        type: CacheType
    ): string | undefined {
        const key = this.createKey(this.hrn, service, serviceVersion, type);
        return this.cache.get(key);
    }

    private createKey(
        hrn: string,
        service: string,
        serviceVersion: string,
        type: CacheType
    ): string {
        return `${hrn}::${service}::${serviceVersion}::${type}`;
    }
}
