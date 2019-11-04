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

import {
    DataStoreDownloadManager,
    DownloadManager,
    EnvironmentName,
    KeyValueCache
} from "@here/olp-sdk-dataservice-read";

/**
 * Params to construct the [[OlpClientSettings]]
 */
export interface OlpClientSettingsParams {
    /**
     * Async callback to return a [[Promise]] with token for requests.
     *
     * @example
     * ```typescript
     *  import { UserAuth } from "@here/olp-sdk-authentication";
     *
     *  const userAuth = new UserAuth(/** parameters **);
     *  const getToken = userAuth.getToken();
     * ```
     */
    getToken: () => Promise<string>;

    /**
     * Environment to use for getting url to the look-up api service.
     * You can set the url to you custom service also.
     *
     * @example
     *
     * ```
     *  'here' | 'here-dev' | 'http://127.0.0.1/my-local-api-service'
     * ```
     */
    environment: EnvironmentName;

    /**
     * Download manager for sending requests.
     * Used default [[DataStoreDownloadManager]] if not set.
     *
     * @see interface [[DownloadManager]]
     */
    dm?: DownloadManager;
}

/**
 * OlpClient settings class. Use this class to configure the behaviour of the OlpClient.
 */
export class OlpClientSettings {
    private keyValueCache: KeyValueCache;
    private getValidToken: () => Promise<string>;
    private env: EnvironmentName;
    private dm: DownloadManager;

    constructor(params: OlpClientSettingsParams) {
        this.getValidToken = params.getToken;
        this.env = params.environment;
        this.dm = params.dm || new DataStoreDownloadManager();

        this.keyValueCache = new KeyValueCache();
    }

    /**
     * Download manager for sending requests.
     */
    get downloadManager(): DownloadManager {
        return this.dm;
    }

    /**
     * Async callback to return a [[Promise]] with token for requests
     */
    get token(): () => Promise<string> {
        return this.getValidToken;
    }

    /**
     * Environment to use for getting url to the look-up api service
     */
    get environment(): string {
        return this.env;
    }

    /**
     * Cache expecting a key,value pair
     */
    get cache(): KeyValueCache {
        return this.keyValueCache;
    }
}
