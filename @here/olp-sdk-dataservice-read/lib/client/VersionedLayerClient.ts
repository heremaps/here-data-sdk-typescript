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

import { BlobApi, MetadataApi, QueryApi } from "@here/olp-sdk-dataservice-api";
import {
    addQuadKeys,
    AggregatedDownloadResponse,
    ApiName,
    computeParentKey,
    DataRequest,
    DataStoreRequestBuilder,
    HRN,
    IndexMap,
    isValid,
    mortonCodeFromQuadKey,
    OlpClientSettings,
    PartitionsRequest,
    QuadKey,
    quadKeyFromMortonCode,
    QuadKeyPartitionsRequest,
    QuadTreeIndexRequest,
    QueryClient,
    RequestFactory
} from "@here/olp-sdk-dataservice-read";

/**
 * A class that describes versioned layer
 * and provides possibility to get layer Metadata and Partitions.
 */
export class VersionedLayerClient {
    private readonly apiVersion: string = "v1";
    private readonly hrn: string;
    private readonly indexDepth = 4;

    private static subkeyAddFunction(): (
        quadKey: QuadKey,
        sub: string
    ) => QuadKey {
        return (quadKey: QuadKey, sub: string) => {
            const subQuadKey = quadKeyFromMortonCode(sub);
            return addQuadKeys(quadKey, subQuadKey);
        };
    }

    private static toTileKeyFunction(): (key: string) => QuadKey {
        return (key: string) => quadKeyFromMortonCode(key);
    }

    constructor(
        catalogHrn: HRN,
        readonly layerId: string,
        readonly settings: OlpClientSettings
    ) {
        this.hrn = catalogHrn.toString();
    }

    /**
     * Fetch partition by id or quadKey or dataHandle
     * @param dataRequest Instance of the configuret request params [[DataRequest]]
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     */
    async getData(
        dataRequest: DataRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const dataHandle = dataRequest.getDataHandle();
        const partitionId = dataRequest.getPartitionId();
        const quadKey = dataRequest.getQuadKey();
        const version = dataRequest.getVersion();

        if (
            dataHandle !== undefined ||
            partitionId !== undefined ||
            quadKey !== undefined
        ) {
            if (dataHandle) {
                return this.downloadPartition(dataHandle, abortSignal);
            }

            if (partitionId) {
                const partitionIdDataHandle = await this.getDataHandleByPartitionId(
                    partitionId,
                    version
                ).catch(error => Promise.reject(error));
                return this.downloadPartition(
                    partitionIdDataHandle,
                    abortSignal
                );
            }

            if (quadKey) {
                const quadKeyPartitionsRequest = new QuadKeyPartitionsRequest().withQuadKey(
                    quadKey
                );
                const quadTreeIndex = await this.getPartitions(
                    quadKeyPartitionsRequest
                ).catch(error => Promise.reject(error));
                return this.downloadPartition(
                    quadTreeIndex.subQuads[0].dataHandle,
                    abortSignal
                );
            }
        }

        return Promise.reject(
            new Error(
                `No data provided. Add dataHandle, partitionId or quadKey to the DataRequest object`
            )
        );
    }

    /**
     * Fetch and returns partition metadata
     * @param partitionId The name of the partition to fetch.
     * @param version The version of the layer to fetch
     * @returns A promise of partition metadata which used to get partition data
     */
    private async getDataHandleByPartitionId(
        partitionId: string,
        version?: number
    ): Promise<string> {
        const queryRequestBilder = await this.getRequestBuilder("query");
        const latestVersion = version || (await this.getLatestVersion());
        const partitions = await QueryApi.getPartitionsById(
            queryRequestBilder,
            {
                version: `${latestVersion}`,
                layerId: this.layerId,
                partition: [partitionId]
            }
        );
        const partition = partitions.partitions.find(element => {
            return element.partition === partitionId;
        });

        return partition && partition.dataHandle
            ? partition.dataHandle
            : Promise.reject(
                  `No partition dataHandle for partition ${partitionId}. HRN: ${this.hrn}`
              );
    }

    /**
     * @deprecated Instead could be used getData method
     * Asynchronously fetches a partition from this layer.
     * Used to get partition with generic partition type
     * To get partition with HERETile partition type use @this getTile method
     * @param partitionId The name of the partition to fetch.
     * @param partitionRequestInit Optional request options to be passed to fetch when downloading a
     * partition.
     * @returns A promise of the http response that contains the payload of the requested partition.
     */
    async getPartition(
        partitionId: string,
        partitionRequestInit?: RequestInit
    ): Promise<Response> {
        const partitions = await this.downloadPartitionData(partitionId);
        const partition = partitions.partitions.find(element => {
            return element.partition === partitionId;
        });
        if (partition === undefined) {
            return Promise.reject(
                new Error(
                    `Unknown partition: ${partitionId} in layer ${this.layerId}. HRN: ${this.hrn}`
                )
            );
        }
        if (!partition.dataHandle) {
            return Promise.reject(
                new Error(
                    `No partition dataHandle for partition ${partition}. HRN: ${this.hrn}`
                )
            );
        }

        return this.downloadPartition(partition.dataHandle);
    }

    /**
     * @deprecated Instead could be used getData method     *
     * Asynchronously fetches a tile from this catalog.
     * Used to get partition with HEREtile partition type
     *
     * Note: If the tile doesn't exist in the catalog, a successful response with a `204` status
     * code is returned.
     *
     * Example:
     *
     * ```typescript
     * const response = versionedLayerClient.getTile(tileKey);
     * if (!response.ok) {
     *     // a network error happened
     *     console.error("Unable to download tile", response.statusText);
     *     return;
     * }
     * if (response.status === 204) {
     *     // 204 - NO CONTENT, no data exists at the given tile. Do nothing.
     *     return;
     * }
     *
     * // the response is ok and contains data, access it, for example, as arrayBuffer:
     * const payload = await response.arrayBuffer();
     * ```
     *
     * @param quadKey The quad key of the tile.
     * @param tileRequestInit Optional request options to be passed to fetch when downloading a
     * tile.
     * @returns A promise of the HTTP response that contains the payload of the requested tile.
     */
    async getTile(quadKey: QuadKey): Promise<Response> {
        if (!isValid(quadKey)) {
            throw Error("QuadKey is not valid");
        }

        const index = await this.getIndexFor(quadKey);
        const resultSub = index.get(mortonCodeFromQuadKey(quadKey));

        if (resultSub === undefined) {
            return Promise.resolve(new Response(null, { status: 204 }));
        }

        return this.downloadPartition(resultSub);
    }

    /**
     * Asynchronously fetches an aggregated tile from this layer.
     *
     * The result of this operation is the tile at the given tileKey or the closest ancestor that
     * contains data.
     *
     * @param quadKey The quad key of the tile.
     * @param tileRequestInit Optional request options to be passed to fetch when downloading a
     * tile.
     * @returns A promise of the http response that contains the payload of the requested tile.
     */
    async getAggregatedTile(
        quadKey: QuadKey
    ): Promise<AggregatedDownloadResponse> {
        const index = await this.getIndexFor(quadKey);

        const resultIdx = this.findAggregatedIndex(index, quadKey);

        if (resultIdx === undefined) {
            return Promise.resolve(new Response(null, { status: 204 }));
        }

        const response = (await this.downloadPartition(
            resultIdx.dataHandle
        )) as AggregatedDownloadResponse;
        response.quadKey = resultIdx.quadKey;
        return response;
    }

    /**
     * Fetch partitions metadata from Query API by QuadKey
     * @returns Quad Tree Index for partition
     */
    async getPartitions(
        quadKeyPartitionsRequest: QuadKeyPartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index>;

    /**
     * Fetch all partitions metadata from layer
     * @returns list of partittions metadata
     */
    async getPartitions(
        partitionsRequest: PartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<MetadataApi.Partitions>;

    async getPartitions(
        request: QuadKeyPartitionsRequest | PartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index | MetadataApi.Partitions> {
        if (request instanceof QuadKeyPartitionsRequest) {
            const quadKey = request.getQuadKey();
            if (!quadKey) {
                return Promise.reject("Please provide correct QuadKey");
            }

            const queryClient = new QueryClient(this.settings);

            const quadTreeIndexRequest = new QuadTreeIndexRequest(
                HRN.fromString(this.hrn),
                this.layerId,
                "versioned"
            )
                .withQuadKey(quadKey)
                .withVersion(request.getVersion())
                .withDepth(request.getDepth());

            const forSpecificCatalogVersion = request.getVersion();
            if (forSpecificCatalogVersion) {
                quadTreeIndexRequest.withVersion(forSpecificCatalogVersion);
            }

            return queryClient.fetchQuadTreeIndex(
                quadTreeIndexRequest,
                abortSignal
            );
        }

        const metaRequestBilder = await this.getRequestBuilder(
            "metadata",
            abortSignal
        );
        const version = request.getVersion() || (await this.getLatestVersion());
        return MetadataApi.getPartitions(metaRequestBilder, {
            version,
            layerId: this.layerId
        });
    }

    /**
     * Asynchronously gets index metadata versioned layers.
     * Can be used to get partitionId
     *
     * @param rootKey The root quad key of the returned index.
     * @returns A promise to the index object parsed as a map.
     */
    async getIndexMetadata(rootKey: QuadKey): Promise<IndexMap> {
        if (!isValid(rootKey)) {
            return Promise.reject(new Error("QuadKey is not valid"));
        }
        return this.downloadIndex(rootKey);
    }

    /**
     * Fetch and returns partition metadata
     * @param partitionId The name of the partition to fetch.
     * @returns A promise of partition metadata which used to get partition data
     */
    private async downloadPartitionData(
        partitionId: string
    ): Promise<QueryApi.Partitions> {
        const queryRequestBilder = await this.getRequestBuilder("query");
        const latestVersion = await this.getLatestVersion();
        return QueryApi.getPartitionsById(queryRequestBilder, {
            version: `${latestVersion}`,
            layerId: this.layerId,
            partition: [partitionId]
        });
    }

    /**
     * Gets the latest available catalog version what can be used as latest layer version
     */
    private async getLatestVersion(): Promise<number> {
        const builder = await this.getRequestBuilder("metadata").catch(error =>
            Promise.reject(error)
        );
        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion: -1
        }).catch(async (error: Response) =>
            Promise.reject(
                new Error(
                    `Metadata Service error: HTTP ${
                        error.status
                    }, ${error.statusText || ""}`
                )
            )
        );
        return latestVersion.version;
    }

    // finds any index that contains the given tile key
    private async getIndexFor(quadKey: QuadKey): Promise<IndexMap> {
        return this.downloadIndex(computeParentKey(quadKey, this.indexDepth));
    }

    // downloads the index
    private async downloadIndex(indexRootKey: QuadKey): Promise<IndexMap> {
        let dsIndex: QueryApi.Index;
        const queryRequestBuilder = await this.getRequestBuilder("query");
        const version = await this.getLatestVersion();

        dsIndex = await QueryApi.quadTreeIndex(queryRequestBuilder, {
            version,
            layerId: this.layerId,
            quadKey: mortonCodeFromQuadKey(indexRootKey).toString(),
            depth: this.indexDepth
        });

        return this.parseIndex(indexRootKey, dsIndex);
    }

    private parseIndex(
        indexRootKey: QuadKey,
        dsIndex: QueryApi.Index
    ): IndexMap {
        const subkeyAddFunction = VersionedLayerClient.subkeyAddFunction();
        const toTileKeyFunction = VersionedLayerClient.toTileKeyFunction();

        const subQuads = new Map<number, string>();

        if (!dsIndex || dsIndex.subQuads === undefined) {
            return subQuads;
        }

        for (const sub of dsIndex.subQuads) {
            const subTileKey: QuadKey = subkeyAddFunction(
                indexRootKey,
                sub.subQuadKey
            );
            subQuads.set(mortonCodeFromQuadKey(subTileKey), sub.dataHandle);
        }

        if (dsIndex.parentQuads !== undefined) {
            for (const parent of dsIndex.parentQuads) {
                const parentTileKey = toTileKeyFunction(parent.partition);
                subQuads.set(
                    mortonCodeFromQuadKey(parentTileKey),
                    parent.dataHandle
                );
            }
        }

        return subQuads;
    }

    private async downloadPartition(
        dataHandle: string,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const builder = await this.getRequestBuilder("blob", abortSignal);
        return BlobApi.getBlob(builder, {
            dataHandle,
            layerId: this.layerId
        }).catch(async error => Promise.reject(error));
    }

    /**
     * Fetch baseUrl and create requestBuilder for sending requests to the look-up API
     * @param builderType endpoint name is needed to create propriate requestBuilder
     *
     * @returns requestBuilder
     */
    private async getRequestBuilder(
        builderType: ApiName,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.create(
            builderType,
            this.apiVersion,
            this.settings,
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(err =>
            Promise.reject(
                `Error retrieving from cache builder for resource "${this.hrn}" and api: "${builderType}.\n${err}"`
            )
        );
    }

    private findAggregatedIndex(
        index: IndexMap,
        quadKey: QuadKey
    ): { dataHandle: string; quadKey: QuadKey } | undefined {
        // get the index of the closest parent
        let key = quadKey;

        for (let level = quadKey.level; level >= 0; --level) {
            const sub = index.get(mortonCodeFromQuadKey(key));
            if (sub !== undefined) {
                return { dataHandle: sub, quadKey: key };
            }
            key = computeParentKey(key, 1);
        }

        return undefined;
    }
}
