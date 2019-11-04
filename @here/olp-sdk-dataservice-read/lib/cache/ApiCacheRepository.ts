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

import { HRN } from "../HRN";
import { KeyValueCache } from "./KeyValueCache";

/**
 * The list of API names of endpoints exists in the API
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
 * Class for cache base urls to the API expecting a key,value pair.
 * Key format is: <hrn>::<service_name>::<serviceVersion>::api
 */
export class ApiCacheRepository {
    private readonly hrn: string;

    constructor(private readonly cache: KeyValueCache, hrn?: HRN) {
        this.hrn = hrn ? hrn.toString() : "platform-api";
    }

    /**
     * Store key,value pair into the cache
     * @param service The name of the service in the api
     * @param serviceVersion The version of the service
     * @param serviceUrl The base url of the service
     * @return Returns true if the operation is successfull, false otherwise.
     */
    public put(
        service: ApiName,
        serviceVersion: string,
        serviceUrl: string
    ): boolean {
        const key = this.createKey(this.hrn, service, serviceVersion);
        return this.cache.put(key, serviceUrl);
    }

    /**
     * Store key,value pair into the cache
     * @param service
     * @param serviceVersion
     * @returns The base url of the service or undefined if not exists
     */
    public get(service: string, serviceVersion: string): string | undefined {
        const key = this.createKey(this.hrn, service, serviceVersion);
        return this.cache.get(key);
    }

    private createKey(
        hrn: string,
        service: string,
        serviceVersion: string
    ): string {
        return hrn + "::" + service + "::" + serviceVersion + "::api";
    }
}
