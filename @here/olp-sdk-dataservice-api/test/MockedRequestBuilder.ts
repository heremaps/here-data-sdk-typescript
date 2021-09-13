/*
 * Copyright (C) 2021 HERE Europe B.V.
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

import { RequestBuilder, RequestOptions } from "../lib/RequestBuilder";

export class MockedRequestBuilder extends RequestBuilder {
    constructor(
        private readonly params: {
            baseUrl?: string;
            request?: <T>(url: string, init?: RequestOptions) => Promise<T>;
            requestBlob?: (
                url: string,
                init?: RequestOptions
            ) => Promise<Response>;
        }
    ) {
        super(params.baseUrl || "http://mocked.url");
    }

    async download<T>(url: string, init?: RequestOptions): Promise<T> {
        return this.params.request
            ? this.params.request(url, init)
            : Promise.resolve({} as T);
    }

    async downloadBlob(url: string, init?: RequestOptions): Promise<Response> {
        return this.params.requestBlob
            ? this.params.requestBlob(url, init)
            : Promise.resolve(new Response());
    }
}
