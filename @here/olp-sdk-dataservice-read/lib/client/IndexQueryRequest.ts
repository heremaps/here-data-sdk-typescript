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

/**
 * Prepares information for calls to get partitions metadata from the OLP Index Service.
 */
export class IndexQueryRequest {
    private queryString?: string;
    private isHugeResponse?: boolean;

    /**
     * @param query An RSQL query to use to retrieve partitions that match the query.
     * The query must use the indexing attributes defined in the index layer.
     * @returns The updated [[IndexQueryRequest]] instance that you can use to chain methods.
     */
    public withQueryString(query?: string): IndexQueryRequest {
        this.queryString = query;
        return this;
    }

    /**
     * A setter for the provided isHugeResponse parameter.
     *
     * @param isHuge The boolean parameter shows is the query huge.
     *
     * @returns The updated [[IndexQueryRequest]] instance that you can use to chain methods.
     */
    public withHugeResponse(isHuge: boolean): IndexQueryRequest {
        this.isHugeResponse = isHuge;
        return this;
    }

    /**
     * Gets a queryString for the request.
     *
     * @return The queryString string.
     */
    public getQueryString(): string | undefined {
        return this.queryString;
    }

    /**
     * Gets isHugeResponse property for the request.
     *
     * @return The `isHugeResponse` boolean.
     */
    public getHugeResponse(): boolean | undefined {
        return this.isHugeResponse;
    }
}
