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

import { MetadataApi, QueryApi } from "@here/olp-sdk-dataservice-api";
import {
    HRN,
    isValid,
    mortonCodeFromQuadKey,
    OlpClientSettings,
    QuadTreeIndexRequest,
    RequestFactory
} from "@here/olp-sdk-dataservice-read";

/**
 * The [[QueryClient]] is client to the query service provides a way to get information (metadata)
 * about layers and partitions stored in a catalog.
 * This service exposes the metadata for single partitions that users can query one by one or by specifying a parent tile.
 */
export class QueryClient {
    private readonly apiVersion = "v1";

    /**
     * Constructs a new client for Query Service
     * @param settings The instance of [[OlpClientSettings]]
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Fetch the Quad Tree Index
     * @param requestParams Configured instance of [[QuadTreeIndexRequest]]
     * @param abortSignal The signal to aborting request
     */
    public async fetchQuadTreeIndex(
        requestParams: QuadTreeIndexRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index> {
        const quadKey = requestParams.getQuadKey();
        const layerId = requestParams.getLayerId();

        if (!quadKey || !isValid(quadKey)) {
            return Promise.reject("Please provide correct QuadKey");
        }

        if (!layerId) {
            return Promise.reject("Please provide correct Id of the Layer");
        }

        const catalogVersion =
            requestParams.getVersion() ||
            (await this.getCatalogLatestVersion(
                requestParams.getCatalogHrn(),
                abortSignal
            ).catch(error =>
                Promise.reject(
                    `Error getting the last catalog version: ${error}`
                )
            ));

        if (!catalogVersion) {
            return Promise.reject(`Please provide correct catalog version`);
        }

        const request = await RequestFactory.create(
            "query",
            this.apiVersion,
            this.settings,
            requestParams.getCatalogHrn(),
            abortSignal
        ).catch(error =>
            Promise.reject(
                `Erorr creating request object for query service: ${error}`
            )
        );

        const subQuadKeysMaxLength = requestParams.getDepth();

        let fetchingQuadTreeIndexFunction:
            | typeof QueryApi.quadTreeIndex
            | typeof QueryApi.quadTreeIndexVolatile;

        let paramsForFetchQuadTreeIndex: {
            version: number;
            layerId: string;
            quadKey: string;
            depth: number;
        } = {
            version: 0,
            layerId,
            depth: subQuadKeysMaxLength,
            quadKey: mortonCodeFromQuadKey(quadKey).toString()
        };

        if (requestParams.getLayerType() === "volatile") {
            fetchingQuadTreeIndexFunction = QueryApi.quadTreeIndexVolatile;
        } else {
            fetchingQuadTreeIndexFunction = QueryApi.quadTreeIndex;
            paramsForFetchQuadTreeIndex = {
                ...paramsForFetchQuadTreeIndex,
                version: catalogVersion
            };
        }

        return fetchingQuadTreeIndexFunction(
            request,
            paramsForFetchQuadTreeIndex
        );
    }

    /**
     * Gets the latest available catalog version
     */
    private async getCatalogLatestVersion(
        catalogHrn: HRN,
        abortSignal?: AbortSignal
    ): Promise<number> {
        const request = await RequestFactory.create(
            "metadata",
            this.apiVersion,
            this.settings,
            catalogHrn,
            abortSignal
        ).catch(error =>
            Promise.reject(
                `Erorr creating request object for metadata service: ${error}`
            )
        );

        const latestVersion = await MetadataApi.latestVersion(request, {
            startVersion: -1
        }).catch(error => Promise.reject(error));

        return Promise.resolve(latestVersion.version);
    }
}
