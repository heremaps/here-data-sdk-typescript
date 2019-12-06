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

/**
 * An implementation of [[RequestBuilder]] and the `downloadBlob` and `download` methods.
 * It is used to configure the [[RequestBuilder]] instance with a base URL of a service.
 */
export class DataStoreRequestBuilder extends RequestBuilder {
    /**
     * Cerates the [[DataStoreRequestBuilder]] instance.
     * 
     * @param downloadManager The configured instance of the [[DownloadManager]] interface implementation.
     * You can use our default [[DatastoreDownloadManager]] or create your implementation.
     * @param baseUrl The URL string.
     * @param getBearerToken Retrieves the access token.
     * @return The access token.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     * @return The [[DataStoreRequestBuilder]] instance.
     */
    constructor(
        readonly downloadManager: DownloadManager,
        baseUrl: string,
        private readonly getBearerToken: () => Promise<string>,
        private readonly abortSignal?: AbortSignal
    ) {
        super(baseUrl);
    }

    /**
     * Downloads data from the provided URL.
     * 
     * @param url The URL of the data that you want to download.
     * @param init The helper object for the request.
     * @return The data of the type specified in the generics.
     */
    async download<T>(url: string, init?: RequestInit): Promise<T> {
        let options = await this.addBearerToken(init);
        if (this.abortSignal) {
            options = {
                ...options,
                ...this.addAbortSignal(init)
            };
        }
        return this.downloadManager
            .download(url, options)
            .then(result => result.json())
            .catch(err => Promise.reject(err));
    }

    /**
     * Downloads the blob data from the specified URL.
     * 
     * @param url The URL of the blob data that you want to download.
     * @param init The helper object for the request.
     * @return The blob data.
     */
    async downloadBlob(url: string, init?: RequestInit): Promise<Response> {
        let options = await this.addBearerToken(init);
        if (this.abortSignal) {
            options = {
                ...options,
                ...this.addAbortSignal(init)
            };
        }
        return this.downloadManager
            .download(url, options)
            .catch(err => Promise.reject(err));
    }

    private async addBearerToken(init?: RequestInit): Promise<RequestInit> {
        return addBearerToken(this.getBearerToken, init);
    }

    private addAbortSignal(init?: RequestInit): RequestInit {
        const options: RequestInit = init || {};
        options.signal = this.abortSignal;
        return options;
    }
}
