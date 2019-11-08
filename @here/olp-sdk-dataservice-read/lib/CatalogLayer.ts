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
    ConfigApi,
    CoverageApi,
    MetadataApi
} from "@here/olp-sdk-dataservice-api";
import { DataRequest, IndexMap, PartitionsRequest, QuadKey } from "@here/olp-sdk-dataservice-read";

/**
 * @deprecated
 * A convenience interface that describes
 * a versioned or volatile layer in a catalog.
 *
 * Can be used for back-compatibility for old consumers if they wont to use
 * the new [[VersionedLayerClient]] or [[VolatileLayerClient]] classes.
 */
export interface CatalogLayer extends ConfigApi.Layer {
    /**
     * The Data Service API version this `CatalogLayer` supports.
     */
    apiVersion: 2;

    /**
     * The version of this layer.
     */
    version?: number;

    /**
     * Asynchronously fetches a tile from this layer.
     *
     * Note: If the tile doesn't exist in the layer, a successful response with a `204` status code
     * is returned.
     *
     * Example:
     *
     * ```typescript
     * const response = layer.getTile(tileKey);
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
     * @returns A promise of the HTTP response that contains the payload of the requested tile.
     */
    getTile?: (quadKey: QuadKey) => Promise<Response>;

    getData?: (dataRequest: DataRequest) => Promise<Response>;

    /**
     * Fetch all partitions metadata from layer
     * @returns list of partittions metadata
     */
    getPartitions?: (
        partitionsRequest: PartitionsRequest
    ) => Promise<MetadataApi.Partitions>;

    /**
     * Asynchronously fetches a partition from this layer.
     *
     * @param partitionId The id of the partition to fetch.
     * @param partitionRequestInit Optional request options to be passed to fetch when downloading a
     * partition.
     * @returns A promise of the http response that contains the payload of the requested partition.
     */
    getPartition?: (
        partitionId: string,
        partitionRequestInit?: RequestInit
    ) => Promise<Response>;

    /**
     * Asynchronously gets a tile index.
     *
     * @param rootKey The root quad key of the returned index.
     * @returns A promise to the index object parsed as a map.
     */
    getIndex: (rootKey: QuadKey) => Promise<IndexMap>;

    /**
     * Fetch all partitions metadata from layer
     * @returns list of partittions metadata
     */
    getPartitionsIndex?: () => Promise<MetadataApi.Partitions>;

    /**
     * Asynchronously fetches data coverage bitmap of this layer.
     * @param RequestInit Optional request options to be passed to fetch when downloading a
     * coverage map.
     * @returns A promise of the http response that contains the payload of the requested coverage
     * map.
     */
    getDataCoverageBitmap?: (requestInit?: RequestInit) => Promise<Response>;

    /**
     * Asynchronously fetches data coverage size map of this layer.
     * @param RequestInit Optional request options to be passed to fetch when downloading a
     * coverage map.
     * @returns A promise of the http response that contains the payload of the requested coverage
     * map.
     */
    getDataCoverageSizeMap?: (requestInit?: RequestInit) => Promise<Response>;

    /**
     * Asynchronously fetches data coverage time map of this layer.
     * @param RequestInit Optional request options to be passed to fetch when downloading a
     * coverage map.
     * @returns A promise of the http response that contains the payload of the requested coverage
     * map.
     */
    getDataCoverageTimeMap?: (requestInit?: RequestInit) => Promise<Response>;

    /**
     * Asynchronously fetches summary data for this layer.
     * @param RequestInit Optional request options to be passed to fetch when downloading a
     * summary data.
     * @returns A promise of the http response that contains the summary data.
     */
    getSummary?: (
        requestInit?: RequestInit
    ) => Promise<CoverageApi.LayerSummary>;
}
