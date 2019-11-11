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
    BlobApi,
    ConfigApi,
    MetadataApi,
    QueryApi
} from "@here/olp-sdk-dataservice-api";
import {
    AggregatedDownloadResponse,
    ApiName,
    DataStoreRequestBuilder,
    ErrorHTTPResponse,
    HRN,
    IndexMap,
    OlpClientSettings,
    QuadKey,
    RequestFactory
} from "@here/olp-sdk-dataservice-read";
import * as utils from "../partitioning/QuadKeyUtils";

export class VolatileLayerClient {
    private readonly apiVersion: string = "v1";
    readonly hrn: string;

    private readonly indexDepth = 4;

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

    constructor(
        catalogHrn: HRN,
        readonly layerId: string,
        readonly settings: OlpClientSettings
    ) {
        this.hrn = catalogHrn.toString();
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
        }).catch(this.errorHandler);
    }

    /**
     * Fetch all partitions metadata from layer
     * @returns list of partittions metadata
     */
    async getPartitionsMetadata(): Promise<MetadataApi.Partitions> {
        const metaRequestBilder = await this.getRequestBuilder("metadata");
        return MetadataApi.getPartitions(metaRequestBilder, {
            layerId: this.layerId
        });
    }

    /**
     * Asynchronously gets index metadata volatile layers.
     * Can be used to get partitionId
     *
     * @param rootKey The root quad key of the returned index.
     * @returns A promise to the index object parsed as a map.
     */
    async getIndexMetadata(rootKey: QuadKey): Promise<IndexMap> {
        if (!utils.isValid(rootKey)) {
            return Promise.reject(new Error("QuadKey is not valid"));
        }
        return this.downloadIndex(rootKey);
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
     * const response = volatileLayerClient.getTile(tileKey);
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

    private async errorHandler(error: any) {
        return Promise.reject(
            new ErrorHTTPResponse(
                `Statistics Service error: HTTP ${
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
        return this.downloadIndex(
            utils.computeParentKey(quadKey, this.indexDepth)
        );
    }

    private async downloadTile(dataHandle: string): Promise<Response> {
        const builder = await this.getRequestBuilder("blob");
        return BlobApi.getBlob(builder, {
            dataHandle,
            layerId: this.layerId
        }).catch(this.errorHandler);
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
        return QueryApi.getPartitionsById(queryRequestBilder, {
            layerId: this.layerId,
            partition: [partitionId]
        });
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

    // downloads and caches the index
    private async downloadIndex(indexRootKey: QuadKey): Promise<IndexMap> {
        let dsIndex: ConfigApi.Index;
        const queryRequestBuilder = await this.getRequestBuilder("query");

        dsIndex = await QueryApi.quadTreeIndexVolatile(queryRequestBuilder, {
            layerId: this.layerId,
            quadKey: utils.mortonCodeFromQuadKey(indexRootKey).toString(),
            depth: this.indexDepth
        });

        return this.parseIndex(indexRootKey, dsIndex);
    }

    private parseIndex(
        indexRootKey: QuadKey,
        dsIndex: ConfigApi.Index
    ): IndexMap {
        const subkeyAddFunction = VolatileLayerClient.subkeyAddFunction();
        const toTileKeyFunction = VolatileLayerClient.toTileKeyFunction();

        const subQuads = new Map<number, string>();

        if (!dsIndex) {
            return subQuads;
        }

        if (dsIndex.subQuads === undefined) {
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
