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

import { RequestBuilder } from "@here/olp-sdk-dataservice-api";
import { DownloadManager } from "./DownloadManager";

async function addBearerToken(
    getBearerToken: () => Promise<string>,
    init?: RequestInit
): Promise<RequestInit> {
    if (init === undefined) {
        init = {};
    }

    /**
     * @todo fix datastore-api template generator.
     * It sends empty object for headers, but should be Headers object
     */
    if (
        init.headers === undefined ||
        Object.entries(init.headers).length === 0
    ) {
        init.headers = new Headers();
    }

    const token = await getBearerToken();
    (init.headers as Headers).append("Authorization", "Bearer " + token);

    return init;
}

export class DataStoreRequestBuilder extends RequestBuilder {
    constructor(
        readonly downloadManager: DownloadManager,
        baseUrl: string,
        private readonly getBearerToken: () => Promise<string>
    ) {
        super(baseUrl);
    }

    clone(baseUrl?: string): DataStoreRequestBuilder {
        return new DataStoreRequestBuilder(
            this.downloadManager,
            baseUrl === undefined ? this.baseUrl : baseUrl,
            this.getBearerToken
        );
    }

    async download<T>(url: string, init?: RequestInit): Promise<T> {
        const options = await this.addBearerToken(init);
        return this.downloadManager
            .download(url, options)
            .then(async response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(JSON.stringify(response));
            })
            .catch(err => {
                throw err;
            });
    }

    async downloadData(url: string, init?: RequestInit): Promise<Response> {
        init = await this.addBearerToken(init);
        return this.downloadManager.download(url, init);
    }

    private async addBearerToken(init?: RequestInit): Promise<RequestInit> {
        return addBearerToken(this.getBearerToken, init);
    }
}
