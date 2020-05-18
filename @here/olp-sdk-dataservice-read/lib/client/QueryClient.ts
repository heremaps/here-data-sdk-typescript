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
    AdditionalFields,
    MetadataApi,
    QueryApi
} from "@here/olp-sdk-dataservice-api";
import {
    HRN,
    isValid,
    mortonCodeFromQuadKey,
    OlpClientSettings,
    PartitionsRequest,
    QuadTreeIndexRequest,
    RequestFactory
} from "..";
import { MetadataCacheRepository } from "../cache/MetadataCacheRepository";
import { FetchOptions } from "./FetchOptions";

/**
 * A client for the platform Query Service that provides a way to get information (metadata)
 * about layers and partitions stored in a catalog.
 * This service exposes the metadata for a single partition that you can query one by one or using a parent tile.
 */
export class QueryClient {
    private readonly apiVersion = "v1";

    /**
     * Constructs a new client for the platform Query Service.
     *
     * @param settings The [[OlpClientSettings]] instance.
     * @return The [[QueryClient]] instance.
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Fetches the quadtree index.
     *
     * @param request The configured [[QuadTreeIndexRequest]] instance.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @return The quadtree index object.
     */
    public async fetchQuadTreeIndex(
        request: QuadTreeIndexRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index> {
        const quadKey = request.getQuadKey();
        const layerId = request.getLayerId();

        if (!quadKey || !isValid(quadKey)) {
            return Promise.reject("Please provide correct QuadKey");
        }

        if (!layerId) {
            return Promise.reject("Please provide correct Id of the Layer");
        }

        let catalogVersion = request.getVersion();

        if (catalogVersion === undefined) {
            catalogVersion = await this.getCatalogLatestVersion(
                request.getCatalogHrn(),
                abortSignal,
                request.getBillingTag()
            ).catch(error =>
                Promise.reject(
                    `Error getting the last catalog version: ${error}`
                )
            );
        }

        if (catalogVersion === undefined) {
            return Promise.reject(`Please provide correct catalog version`);
        }

        const requestBuilder = await RequestFactory.create(
            "query",
            this.apiVersion,
            this.settings,
            request.getCatalogHrn(),
            abortSignal
        ).catch(error =>
            Promise.reject(
                `Erorr creating request object for query service: ${error}`
            )
        );

        const subQuadKeysMaxLength = request.getDepth();

        let fetchingQuadTreeIndexFunction:
            | typeof QueryApi.quadTreeIndex
            | typeof QueryApi.quadTreeIndexVolatile;

        let paramsForFetchQuadTreeIndex: {
            version: number;
            layerId: string;
            quadKey: string;
            depth: number;
            billingTag?: string;
            additionalFields?: AdditionalFields;
        } = {
            version: 0,
            layerId,
            depth: subQuadKeysMaxLength,
            quadKey: mortonCodeFromQuadKey(quadKey).toString(),
            billingTag: request.getBillingTag(),
            additionalFields: request.getAdditionalFields()
        };

        if (request.getLayerType() === "volatile") {
            fetchingQuadTreeIndexFunction = QueryApi.quadTreeIndexVolatile;
        } else {
            fetchingQuadTreeIndexFunction = QueryApi.quadTreeIndex;
            paramsForFetchQuadTreeIndex = {
                ...paramsForFetchQuadTreeIndex,
                version: catalogVersion
            };
        }

        return fetchingQuadTreeIndexFunction(
            requestBuilder,
            paramsForFetchQuadTreeIndex
        );
    }

    /**
     * Gets partitions using their IDs.
     *
     * @param request The `PartitionsRequest` instance.
     * @param layerId The ID of the layer from which you want to get partitions.
     * @param hrn The HERE Resource Name (HRN) of the layer.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @return The requested partitions.
     */
    public async getPartitionsById(
        request: PartitionsRequest,
        layerId: string,
        hrn: HRN,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Partitions> {
        const idsList = request.getPartitionIds();
        const version = request.getVersion();

        if (!idsList) {
            return Promise.reject("Please provide correct partitionIds list");
        }

        const cache = new MetadataCacheRepository(this.settings.cache);
        if (request.getFetchOption() !== FetchOptions.OnlineOnly) {
            const cachedPartitions = cache.get(
                request,
                hrn.toString(),
                layerId
            );

            if (cachedPartitions) {
                return Promise.resolve({
                    partitions: cachedPartitions
                });
            }
        }

        const requestBuilder = await RequestFactory.create(
            "query",
            this.apiVersion,
            this.settings,
            hrn,
            abortSignal
        ).catch(error =>
            Promise.reject(
                `Erorr creating request object for query service: ${error}`
            )
        );

        const medatada = await QueryApi.getPartitionsById(requestBuilder, {
            layerId,

            partition: idsList,
            additionalFields: request.getAdditionalFields(),
            version: version !== undefined ? `${version}` : undefined
        }).catch(err => Promise.reject(err));

        if (
            request.getFetchOption() !== FetchOptions.OnlineOnly &&
            medatada &&
            medatada.partitions &&
            medatada.partitions.length
        ) {
            const partitions: MetadataApi.Partition[] = medatada.partitions.map(
                partition => ({
                    checksum: partition.checksum,
                    compressedDataSize: partition.compressedDataSize,
                    dataHandle: partition.dataHandle || "",
                    dataSize: partition.dataSize,
                    partition: partition.partition,
                    version: partition.version
                })
            );
            cache.put(request, hrn.toString(), layerId, partitions);
        }

        return Promise.resolve(medatada);
    }

    /**
     * Gets the latest available catalog version
     */
    private async getCatalogLatestVersion(
        catalogHrn: HRN,
        abortSignal?: AbortSignal,
        billingTag?: string
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
            startVersion: -1,
            billingTag
        }).catch(error => Promise.reject(error));

        return Promise.resolve(latestVersion.version);
    }
}
