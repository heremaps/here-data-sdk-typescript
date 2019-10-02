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

import { LookupApi } from "@here/olp-sdk-dataservice-api";
import { DataStoreDownloadManager } from "./DataStoreDownloadManager";
import { DataStoreRequestBuilder } from "./DataStoreRequestBuilder";
import { DownloadManager } from "./DownloadManager";
import { EnvironmentName, getEnvLookUpUrl } from "./getEnvLookupUrl";

export interface DataStoreContextParams {
    // func, returns Promise with access token
    getToken: () => Promise<string>;
    // Environment to use for getting url to the look-up api service. You can set the url to you custom service also.
    environment: EnvironmentName;
    // Download manager for sending requests. Used default DataStoreDownloadManager if not set.
    dm?: DownloadManager;
}

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
 * DataStoreContext is the context, requires by DataStoreClient, CatalogClient or layers clients.
 * Stores and caches the shared information needed for that clients.
 */
export class DataStoreContext {
    // func, returns Promise with valid access token
    public getToken: () => Promise<string>;

    // Environment to use.
    public environment: EnvironmentName;

    // Download manager for sending requests.
    public dm: DownloadManager;

    private lookUpUrl: string;

    /**
     * Key-value storage for caching base urls to the endpoints for each HRN
     * and for platform endpoints, by endpoint name, requested by the clients.
     *
     * The key "platform" - means the storage for platform-specific APIs
     * @see [[cacheKeyForPlatformItems]]
     *
     * @example of storage:
     *
     * {
     *  "platform": {
     *      "artifact": "https://sub.domen.example.com/api/v1/artifacts",
     *      "metadata": "https://metadata.example.com/api/v1"
     *  },
     *
     *  "hrn:here:data:::test-catalog-1": {
     *      "blob": "https://blob.sub.domen.example.com/v1/hrn:here:data:::test-catalog-1/api",
     *      "index": "https://some-api.sub.domen.example.com/v1/hrn:here:data:::test-catalog-1/index",
     *      ......
     *   },
     *
     *   "hrn:here:data:::another-test-catalog": {
     *      "blob": "https://blob.sub.domen.example.com/v1/another-test-catalog/api",
     *      "index": "https://some-api.sub.domen.example.com/v1/another-test-catalog/index",
     *      ......
     *   },
     *    ......
     * }
     */
    private readonly baseUrlsCache: Map<
        string,
        Map<string, string>
    > = new Map();

    // Key for storage in the cache for platform-specific APIs
    private readonly cacheKeyForPlatformItems = "platform";

    // Request builder for send requests to the look-up API
    private readonly requestBuilder: DataStoreRequestBuilder;

    /**
     * Key-value storage for caching responses from look-up API.
     * Stores LookupApi.API[] for platform specific and for each HRN, requested by clients
     */
    private readonly apiListCache: Map<string, LookupApi.API[]> = new Map();

    constructor(params: DataStoreContextParams) {
        this.lookUpUrl = getEnvLookUpUrl(params.environment);
        this.getToken = params.getToken;
        this.dm = params.dm || new DataStoreDownloadManager();
        this.environment = params.environment;
        this.requestBuilder = new DataStoreRequestBuilder(
            this.dm,
            this.lookUpUrl,
            this.getToken
        );
    }

    /**
     * Gets the base url to the API endpoint requested by name
     *
     * @param apiName The name of supported API, @see ApiName type
     * @param hrn The string, represents HRN. If empty, means that the base url should be for platform API, not for resourses API
     *
     * @returns Promise with BaseUrl to the API endpoint
     */
    async getBaseUrl(apiName: ApiName, hrn?: string): Promise<string> {
        const cacheKey = hrn || this.cacheKeyForPlatformItems;
        const cachedSlot = this.baseUrlsCache.get(cacheKey);

        if (!cachedSlot || !cachedSlot.get(apiName)) {
            return this.fetchAndCacheBaseUrl(apiName, hrn);
        }

        const baseUrl = cachedSlot.get(apiName);
        return baseUrl
            ? Promise.resolve(baseUrl)
            : Promise.reject(
                  new Error(
                      `Can't find cached baseUrl for ${cacheKey}, apiName: ${apiName}`
                  )
              );
    }

    /**
     * Fetch and cache the list of the platform APIs
     *
     * @returns the Promise with the list of the platform APIs.
     */
    private async fetchAndCachePlatformApiList(): Promise<LookupApi.API[]> {
        const apiList = await LookupApi.platformAPIList(
            this.requestBuilder
        ).catch((err: string) =>
            Promise.reject(
                new Error(
                    `Error fetching api list for environment: "${this.environment}".\n${err}`
                )
            )
        );

        this.apiListCache.set(this.cacheKeyForPlatformItems, apiList);
        return Promise.resolve(apiList);
    }

    /**
     * Fetch and cache the list of APIs for a given resource identified by hrn.
     *
     * @param hrn String representing resource HRN.
     * @returns The Promise with the list of APIs for a given resource identified by hrn.
     */
    private async fetchAndCacheResourceApiList(
        hrn: string
    ): Promise<LookupApi.API[]> {
        const apiList = await LookupApi.resourceAPIList(this.requestBuilder, {
            hrn
        }).catch((err: string) =>
            Promise.reject(
                new Error(`Error fetching api list for HRN: "${hrn}".\n${err}`)
            )
        );

        this.apiListCache.set(hrn, apiList);

        return Promise.resolve(apiList);
    }

    /**
     * Fetches the information from look-up service, finds and caches baseUrl for requested API by name
     *
     * @param apiName The name of supported API, @see ApiName type
     * @param hrn The string, represents HRN
     *
     * @returns Promise with Base url to the API endpoint, fetched from cache or from look-up service
     */
    private async fetchAndCacheBaseUrl(
        apiName: ApiName,
        hrn?: string
    ): Promise<string> {
        const cacheSlotKey = hrn || this.cacheKeyForPlatformItems;

        const apiList = hrn
            ? await this.fetchAndCacheResourceApiList(hrn).catch(err =>
                  Promise.reject(err)
              )
            : await this.fetchAndCachePlatformApiList().catch(err =>
                  Promise.reject(err)
              );

        const api = apiList.find(item => item.api === apiName);
        if (!api || !api.baseURL) {
            return Promise.reject(
                new Error(
                    `Api base url not found for ${cacheSlotKey}, API: ${apiName}`
                )
            );
        }

        let cachedSlot = this.baseUrlsCache.get(cacheSlotKey);

        if (!cachedSlot) {
            cachedSlot = new Map();
            cachedSlot.set(apiName, api.baseURL);

            this.baseUrlsCache.set(cacheSlotKey, cachedSlot);
        }

        cachedSlot.set(apiName, api.baseURL);

        return Promise.resolve(api.baseURL);
    }
}
