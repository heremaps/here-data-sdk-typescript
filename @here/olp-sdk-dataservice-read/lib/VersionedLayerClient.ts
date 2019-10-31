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
    AggregatedDownloadResponse,
    ErrorHTTPResponse,
    IndexMap
} from "./CatalogClientCommon";
import { ApiName, DataStoreContext } from "./DataStoreContext";
import { DataStoreRequestBuilder } from "./DataStoreRequestBuilder";

import {
    BlobApi,
    CoverageApi,
    MetadataApi,
    QueryApi
} from "@here/olp-sdk-dataservice-api";
import { HRN } from "./HRN";
import { LRUCache } from "./LRUCache";
import { QuadKey } from "./partitioning/QuadKey";
import * as utils from "./partitioning/QuadKeyUtils";

/**
 * A class that describes versioned layer
 * and provides possibility to get layer Metadata and Partitions.
 */
export class VersionedLayerClient {
    readonly hrn: string;
    readonly layerId: string;
    readonly context: DataStoreContext;
    private readonly indexDepth = 4;
    private INDEX_CACHE_SIZE = 64;
    private readonly indexCache = new LRUCache<string, IndexMap>(
        this.INDEX_CACHE_SIZE
    );

    private static subkeyAddFunction(): (
        quadKey: QuadKey,
        sub: string
    ) => QuadKey {
        return (quadKey: QuadKey, sub: string) => {
            const subQuadKey = utils.quadKeyFromMortonCode(sub);
            return utils.addQuadKeys(quadKey, subQuadKey);
        };
    }

    private static toTileKeyFunction(): (key: string) => QuadKey {
        return (key: string) => utils.quadKeyFromMortonCode(key);
    }

    constructor(catalogHrn: HRN, layerId: string, context: DataStoreContext) {
        this.context = context;
        this.hrn = catalogHrn.toString();
        this.layerId = layerId;
    }

    /**
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

        const builder = await this.getRequestBuilder("blob");
        return BlobApi.getBlob(builder, {
            dataHandle: partition.dataHandle,
            layerId: this.layerId
        }).catch(async error => {
            return Promise.reject(
                new ErrorHTTPResponse(
                    `Blob Service error: HTTP ${
                        error.status
                    }, ${error.statusText || error.cause || ""}` +
                        `\n${error.action || ""}`,
                    error
                )
            );
        });
    }

    /**
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
        if (!utils.isValid(quadKey)) {
            throw Error("QuadKey is not valid");
        }

        const resultSub = await this.getDataTag(quadKey);

        if (resultSub === undefined) {
            return Promise.resolve(new Response(null, { status: 204 }));
        }

        return this.downloadTile(resultSub);
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

        const response = (await this.downloadTile(
            resultIdx.dataHandle
        )) as AggregatedDownloadResponse;
        response.quadKey = resultIdx.quadKey;
        return response;
    }

    /**
     * Fetch all partitions metadata from layer
     * @returns list of partittions metadata
     */
    async getPartitionsMetadata(): Promise<MetadataApi.Partitions> {
        const metaRequestBilder = await this.getRequestBuilder("metadata");
        const latestVersion = await this.getLatestVersion();
        return MetadataApi.getPartitions(metaRequestBilder, {
            version: latestVersion.version,
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
        if (!utils.isValid(rootKey)) {
            return Promise.reject(new Error("QuadKey is not valid"));
        }

        const cachedIndex = this.findCachedIndex(rootKey);
        if (cachedIndex !== undefined) {
            return cachedIndex;
        }

        return this.downloadIndex(rootKey);
    }

    /**
     * Fetch and return data coverage bitmap for the specified layer and version.
     *
     * @param requestInit Optional request options to be passed to fetch when downloading
     * the coverage map.
     *
     *  @returns A promise with the payload of the requested bitmap.
     */
    async getDataCoverageBitMap(): Promise<Response> {
        const coverageRequestBuilder = await this.getRequestBuilder(
            "statistics"
        );
        return CoverageApi.getDataCoverageTile(coverageRequestBuilder, {
            layerId: this.layerId,
            // @todo datalevel is hardcoded. It is known issue, ticket about API bug is created
            datalevel: "12"
        }).catch(this.errorHandler);
    }

    /**
     * Fetch and return data coverage bitmap for the specified layer and version.
     *
     * @param requestInit Optional request options to be passed to fetch when downloading
     * the coverage map.
     *
     *  @returns A promise with the payload of the requested size map.
     */
    async getDataCoverageSizeMap(): Promise<Response> {
        const coverageRequestBuilder = await this.getRequestBuilder(
            "statistics"
        );
        return CoverageApi.getDataCoverageSizeMap(coverageRequestBuilder, {
            layerId: this.layerId,
            // @todo datalevel is hardcoded. It is known issue, ticket about API bug is created
            datalevel: "12"
        }).catch(this.errorHandler);
    }

    /**
     * Fetch and return data coverage time map for the specified layer and version.
     *
     * @param requestInit Optional request options to be passed to fetch when downloading
     * the coverage map.
     *
     *  @returns A promise with the payload of the requested time map.
     */
    async getDataCoverageTimeMap(): Promise<Response> {
        const coverageRequestBuilder = await this.getRequestBuilder(
            "statistics"
        );
        return CoverageApi.getDataCoverageTimeMap(coverageRequestBuilder, {
            layerId: this.layerId,
            // @todo datalevel is hardcoded. It is known issue, ticket about API bug is created
            datalevel: "12",
            catalogHRN: this.hrn
        }).catch(this.errorHandler);
    }

    /**
     * Fetch and return layer summary from the Statistics service.
     *
     * @param requestInit Optional request options to be passed to fetch when downloading summary.
     *
     * @returns A promise with the layer summary.
     */
    async getSummary(): Promise<CoverageApi.LayerSummary> {
        const coverageRequestBuilder = await this.getRequestBuilder(
            "statistics"
        );
        return CoverageApi.getDataCoverageSummary(coverageRequestBuilder, {
            layerId: this.layerId
        }).catch(this.errorHandler);
    }

    /**
     * Gets the latest available catalog version what can be used as latest layer version
     */
    private async getLatestVersion(): Promise<MetadataApi.VersionResponse> {
        const builder = await this.getRequestBuilder("metadata").catch(error =>
            Promise.reject(error)
        );
        return MetadataApi.latestVersion(builder, {
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
    }

    private async errorHandler(error: any) {
        return Promise.reject(
            new ErrorHTTPResponse(
                `Statistic Service error: HTTP ${
                    error.status
                }, ${error.statusText || error.cause || ""}` +
                    `\n${error.action || ""}`,
                error
            )
        );
    }

    /**
     * gets the data tag for the given tile
     * @param quadKey
     */
    private async getDataTag(quadKey: QuadKey): Promise<string | undefined> {
        const index = await this.getIndexFor(quadKey);
        return index.get(utils.mortonCodeFromQuadKey(quadKey));
    }

    // finds any index that contains the given tile key
    private async getIndexFor(quadKey: QuadKey): Promise<IndexMap> {
        for (let depth = this.indexDepth; depth >= 0; --depth) {
            const currentIndex = this.findCachedIndex(
                utils.computeParentKey(quadKey, depth)
            );
            if (currentIndex !== undefined) {
                return currentIndex;
            }
        }

        const index = await this.downloadIndex(
            utils.computeParentKey(quadKey, this.indexDepth)
        );
        return index;
    }

    // downloads and caches the index
    private async downloadIndex(indexRootKey: QuadKey): Promise<IndexMap> {
        let dsIndex: QueryApi.Index;
        const cacheKey =
            this.layerId +
            "/" +
            utils.mortonCodeFromQuadKey(indexRootKey).toString();
        const queryRequestBuilder = await this.getRequestBuilder("query");
        const latestVersion = await this.getLatestVersion();

        dsIndex = await QueryApi.quadTreeIndex(queryRequestBuilder, {
            version: latestVersion.version,
            layerId: this.layerId,
            quadKey: utils.mortonCodeFromQuadKey(indexRootKey).toString(),
            depth: this.indexDepth
        });

        // check the cache again in case of parallel requests
        const cachedIndex = this.indexCache.get(cacheKey);
        if (cachedIndex !== undefined) {
            return cachedIndex;
        }

        const index = this.parseIndex(indexRootKey, dsIndex);
        this.cacheIndex(cacheKey, index);
        return index;
    }

    private cacheIndex(cacheKey: string, index: IndexMap): void {
        this.indexCache.set(cacheKey, index);
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
            subQuads.set(
                utils.mortonCodeFromQuadKey(subTileKey),
                sub.dataHandle
            );
        }

        if (dsIndex.parentQuads !== undefined) {
            for (const parent of dsIndex.parentQuads) {
                const parentTileKey = toTileKeyFunction(parent.partition);
                subQuads.set(
                    utils.mortonCodeFromQuadKey(parentTileKey),
                    parent.dataHandle
                );
            }
        }

        return subQuads;
    }

    // // finds a cached index for the given tile
    private findCachedIndex(quadKey: QuadKey): IndexMap | undefined {
        const cacheKey =
            this.layerId +
            "/" +
            utils.mortonCodeFromQuadKey(quadKey).toString();
        return this.indexCache.get(cacheKey);
    }

    private async downloadTile(dataHandle: string): Promise<Response> {
        const builder = await this.getRequestBuilder("blob");
        return BlobApi.getBlob(builder, {
            dataHandle,
            layerId: this.layerId
        }).catch(async error => {
            return Promise.reject(
                new ErrorHTTPResponse(
                    `Blob Service error: HTTP ${
                        error.status
                    }, ${error.statusText || error.cause || ""}` +
                        `\n${error.action || ""}`,
                    error
                )
            );
        });
    }

    /**
     * Fetch baseUrl and create requestBuilder for sending requests to the look-up API
     * @param builderType endpoint name is needed to create propriate requestBuilder
     *
     * @returns requestBuilder
     */
    private async getRequestBuilder(
        builderType: ApiName
    ): Promise<DataStoreRequestBuilder> {
        const url = await this.context
            .getBaseUrl(builderType, this.hrn)
            .catch(err =>
                Promise.reject(
                    `Error retrieving from cache builder for resource "${this.hrn}" and api: "${builderType}.\n${err}"`
                )
            );
        return new DataStoreRequestBuilder(
            this.context.dm,
            url,
            this.context.getToken
        );
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
            version: `${latestVersion.version}`,
            layerId: this.layerId,
            partition: [partitionId]
        });
    }

    private findAggregatedIndex(
        index: IndexMap,
        quadKey: QuadKey
    ): { dataHandle: string; quadKey: QuadKey } | undefined {
        // get the index of the closest parent
        let key = quadKey;

        for (let level = quadKey.level; level >= 0; --level) {
            const sub = index.get(utils.mortonCodeFromQuadKey(key));
            if (sub !== undefined) {
                return { dataHandle: sub, quadKey: key };
            }
            key = utils.computeParentKey(key, 1);
        }

        return undefined;
    }
}
