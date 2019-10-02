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

import { QuadKey } from "./partitioning/QuadKey";

/**
 * A typedef for a map that matches subkeys to the meta data of the given subkey.
 */
export type IndexMap = Map<number, string>;

export class ErrorHTTPResponse extends Error {
    name = "HTTPError";
    message: string;
    status: number;
    statusText: string;
    constructor(message?: string, httpResponse?: Response) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.message = message || "";
        this.statusText = (httpResponse && httpResponse.statusText) || "";
        this.status = (httpResponse && httpResponse.status) || 0;
    }
}

/**
 * A download response that includes the actual quadKey being fetched.
 *
 * When downloading aggregated tiles, the tile itself or its closest ancestor is being downloaded.
 * This Response contains the actual tile key that is being downloaded.
 */
export interface AggregatedDownloadResponse extends Response {
    /**
     * The quadKey being downloaded, or `undefined` if an error occurred.
     */
    quadKey?: QuadKey;
}
