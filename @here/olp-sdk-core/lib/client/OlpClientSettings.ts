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

import {
    DataStoreDownloadManager,
    DownloadManager,
    EnvironmentName,
    KeyValueCache
} from "@here/olp-sdk-core";

/**
 * Parameters used to construct the [[OlpClientSettings]] class.
 */
export interface OlpClientSettingsParams {
    /**
     * An asynchronous callback used to return a `Promise` with the access token for requests.
     *
     * @example
     * ```typescript
     *  import { UserAuth } from "@here/olp-sdk-authentication";
     *
     *  const userAuth = new UserAuth(/** parameters **);
     *  const getToken = userAuth.getToken();
     * ```
     *
     * @return The `Promise` with the access token for requests.
     */
    getToken: () => Promise<string>;

    /**
     * An environment that should be used to get the URL of the API Lookup Service.
     * You can also specify a URL of your custom service.
     *
     * @example
     *
     * ```
     *  'here' | 'here-dev' | 'http://127.0.0.1/my-local-api-service'
     * ```
     */
    environment: EnvironmentName;

    /**
     * A download manager for sending requests.
     * If not set, the default [[DataStoreDownloadManager]] class is used.
     *
     * @see [[DownloadManager]]
     */
    dm?: DownloadManager;
}

/**
 * Сonfigures the behaviour of the platform clients (for example, [[CatalogClient]] or [[VersionedLayerClient]]).
 */
export class OlpClientSettings {
    private keyValueCache: KeyValueCache;
    private getValidToken: () => Promise<string>;
    private env: EnvironmentName;
    private dm: DownloadManager;

    /**
     * Creates the [[OlpClientSettings]] instance.
     *
     * @param params Parameters used to construct the [[OlpClientSettings]] class.
     * @return The [[OlpClientSettings]] instance.
     */
    constructor(params: OlpClientSettingsParams) {
        this.getValidToken = params.getToken;
        this.env = params.environment;
        this.dm = params.dm || new DataStoreDownloadManager();
        this.keyValueCache = new KeyValueCache();
    }

    /**
     * A download manager for requests.
     *
     * @return The [[DownloadManager]] instance.
     */
    get downloadManager(): DownloadManager {
        return this.dm;
    }

    /**
     * An asynchronous callback used to return a `Promise` with the access token for requests.
     *
     * @return A function that returns the `Promise` with the access token string for requests.
     */
    get token(): () => Promise<string> {
        return this.getValidToken;
    }

    /**
     * An environment that should be used to get the URL of the API Lookup Service.
     * You can also specify a URL of your custom service.
     *
     * @return The string with the environment name or the URL of your local environment.
     */
    get environment(): string {
        return this.env;
    }

    /**
     * Caches using a key-value pair.
     *
     * @returns The [[KeyValueCache]] instance.
     */
    get cache(): KeyValueCache {
        return this.keyValueCache;
    }
}
