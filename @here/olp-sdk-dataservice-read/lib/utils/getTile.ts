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

import { FetchOptions, HRN, RequestFactory } from "@here/olp-sdk-core";
import { BlobApi } from "@here/olp-sdk-dataservice-api";
import { Index as QuadTreeIndex } from "@here/olp-sdk-dataservice-api/lib/query-api";
import {
    MetadataCacheRepository,
    mortonCodeFromQuadKey,
    OlpClientSettings,
    PartitionsRequest,
    QuadTreeIndexRequest,
    QueryClient,
    TileRequest
} from "..";
import { ApiName } from "../cache";
import { TileRequestParams } from "../client";
import { computeParentKey, QuadKey } from "./QuadKeyUtils";

/**
 * Parameters used to get a tile.
 */
export interface GetTileParams {
    catalogHrn: HRN;
    settings: OlpClientSettings;
    layerId: string;
    layerType: "versioned" | "volatile";
}

/**
 * Gets the tile by the key.
 *
 * The tile is a geometric area represented as a HERE tile.
 * The quad tree metadata fetches the blob of needed tile from the HERE Query Service,
 * then caches it, and returns to the user.
 * To disable caching of metadata use `request.withFetchOption(FetchOptions.OnlineOnly)`.
 *
 * @param rq Requests the [[TileRequest]] instance with the configured parameters.
 * @see [[TileRequest]]
 *
 * @param abortSignal The signal object that allows you to communicate with a request (such as the `fetch` request)
 * and, if required, abort it using the `AbortController` object.
 * @see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
 *
 * @example
 *
 * ```
 *  const params: GetTileParams = {
 *       settings: "% your `OlpClientSettings` instance % ",
 *       catalogHrn: "% the HRN instance of your catalog %",
 *       layerId: "% your layer ID %",
 *       layerType: "% versioned or volatile %",
 *   }
 *
 *  const request = new TileRequest();
 *
 *  const tile1 = await getTile(request.withTileKey(yourTileKey1), params);
 *  const tile2 = await getTile(request.withTileKey(yourTileKey2), params);
 *
 * ```
 *
 * @returns The blob of the requested Tile or the blob of the closest parent Tile.
 */
export async function getTile(
    rq: TileRequest,
    params: TileRequestParams,
    abortSignal?: AbortSignal
): Promise<Response>;

/**
 * @deprecated This parameter will be removed by 10.2020.
 * Please use signature getTile(rq: TileRequest, params: TileRequestParams, abortSignal?: AbortSignal): Promise<Response>
 *
 * Gets the tile by the key.
 *
 * The tile is a geometric area represented as a HERE tile.
 * The quadtree metadata fetches the blob of needed tile from the Query Service API,
 * then caches it, and returns to the user.
 * To disable caching of metadata use `request.withFetchOption(FetchOptions.OnlineOnly)`.
 *
 * @param rq Requests the [[TileRequest]] instance with the configured parameters.
 * @see [[TileRequest]]
 *
 * @param abortSignal The signal object that allows you to communicate with a request (such as the `fetch` request)
 * and, if required, abort it using the `AbortController` object.
 * @see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
 *
 * @example
 *
 * ```
 *  const params: TileRequestParams = {
 *       settings: "% your `OlpClientSettings` instance % ",
 *       catalogHrn: "% the HRN instance of your catalog %",
 *       layerId: "% your layer ID %",
 *       layerType: "% versioned or volatile %",
 *       catalogVersion: "% the catalog version; for versioned layers, the latest version is used by default %"
 *   }
 *
 *  const request = new TileRequest(params);
 *
 *  const tile1 = await getTile(request.withTileKey(yourTileKey1));
 *  const tile2 = await getTile(request.withTileKey(yourTileKey2));
 *
 * ```
 *
 * @returns The blob of the requested Tile or the blob of the closest parent Tile.
 */
export async function getTile(
    rq: TileRequest,
    abortSignal?: AbortSignal
): Promise<Response>;

export async function getTile(
    rq: TileRequest,
    paramsOrSignal?: TileRequestParams | AbortSignal,
    signal?: AbortSignal
): Promise<Response> {
    let params: TileRequestParams | undefined;
    let abortSignal: AbortSignal | undefined;

    if (
        !paramsOrSignal ||
        (paramsOrSignal && paramsOrSignal instanceof AbortSignal)
    ) {
        // usind deprecated
        params = rq.getParams();
        abortSignal = paramsOrSignal;
    } else {
        params = paramsOrSignal;
        abortSignal = signal;
    }

    if (!params) {
        return Promise.reject(
            new Error(
                `Error getting params. Use TileRequest.withParams() method.`
            )
        );
    }

    const cache = new MetadataCacheRepository(params.settings.cache);

    const quadKey = rq.getTileKey();
    if (!quadKey) {
        return Promise.reject(new Error("Please provide correct QuadKey"));
    }

    let catalogVersion: number | undefined;
    let blobType: ApiName = "volatile-blob";

    if (params.layerType === "versioned") {
        blobType = "blob";
        catalogVersion = await rq.getCatalogVersion();
    }

    const blobRequestBuilder = await RequestFactory.create(
        blobType,
        "v1",
        params.settings,
        params.catalogHrn,
        abortSignal
    ).catch(error => Promise.reject(error));

    if (rq.getFetchOption() !== FetchOptions.OnlineOnly) {
        const partitionId = `${mortonCodeFromQuadKey(quadKey)}`;
        const partitionsRequest = new PartitionsRequest()
            .withPartitionIds([partitionId])
            .withVersion(catalogVersion);

        const cachedPartition = cache.get(
            partitionsRequest,
            params.catalogHrn.toString(),
            params.layerId
        );

        if (cachedPartition) {
            return BlobApi.getBlob(blobRequestBuilder, {
                dataHandle: cachedPartition[0].dataHandle,
                layerId: params.layerId,
                billingTag: rq.getBillingTag()
            });
        }
    }

    const quadTreeIndex = await fetchQuadTreeIndex({
        ...params,
        catalogVersion,
        fetchOptions: rq.getFetchOption(),
        quadKey,
        abortSignal,
        billingTag: rq.getBillingTag()
    }).catch(e => Promise.reject(e));

    if (
        !quadTreeIndex ||
        !quadTreeIndex.subQuads ||
        !quadTreeIndex.subQuads.length
    ) {
        return Promise.reject(new Error("Error fetching QuadTreeIndex"));
    }

    // Return the data for the requested QuadKey or for the closest parent
    const subQuads = quadTreeIndex.subQuads;
    let tileKey = quadKey;

    for (let level = quadKey.level; level >= 0; --level) {
        const tileId = mortonCodeFromQuadKey(tileKey);
        const metadata = subQuads.find(
            item => item.subQuadKey === tileId.toString()
        );

        if (metadata) {
            return BlobApi.getBlob(blobRequestBuilder, {
                dataHandle: metadata.dataHandle,
                layerId: params.layerId,
                billingTag: rq.getBillingTag()
            });
        }
        tileKey = computeParentKey(tileKey, 1);
    }

    return Promise.reject(
        new Error(`Error getting blob for Tile: ${JSON.stringify(quadKey)}`)
    );
}

/**
 * The function should request quad tree index for the parent tile with delta 4
 * and cache the responses in cache for later calls.
 * @hidden
 */
export async function fetchQuadTreeIndex(
    params: GetTileParams & {
        quadKey: QuadKey;
        fetchOptions: FetchOptions;
        catalogVersion?: number;
        billingTag?: string;
        abortSignal?: AbortSignal;
    }
): Promise<QuadTreeIndex> {
    const cache = new MetadataCacheRepository(params.settings.cache);
    const delta = 4;

    const queryClient = new QueryClient(params.settings);

    const parentQuadKey = computeParentKey(params.quadKey, delta);
    const quadTreeIndexRequest = new QuadTreeIndexRequest(
        params.catalogHrn,
        params.layerId,
        params.layerType
    )
        .withQuadKey(parentQuadKey)
        .withDepth(delta);

    if (params.layerType === "versioned") {
        quadTreeIndexRequest.withVersion(params.catalogVersion);
    }

    const quadTreeIndex = await queryClient
        .fetchQuadTreeIndex(quadTreeIndexRequest, params.abortSignal)
        .catch(err => Promise.reject(err));

    if (
        params.fetchOptions !== FetchOptions.OnlineOnly &&
        quadTreeIndex.subQuads
    ) {
        const subQuadsToPartitionsList = quadTreeIndex.subQuads.map(item => ({
            partition: item.subQuadKey,
            version: item.version,
            dataHandle: item.dataHandle
        }));
        const mortonCode = `${mortonCodeFromQuadKey(params.quadKey)}`;
        const partitionsRequest = new PartitionsRequest()
            .withPartitionIds([mortonCode])
            .withVersion(params.catalogVersion);

        cache.put(
            partitionsRequest,
            params.catalogHrn.toString(),
            params.layerId,
            subQuadsToPartitionsList
        );

        if (quadTreeIndex.parentQuads && quadTreeIndex.parentQuads.length) {
            cache.put(
                partitionsRequest,
                params.catalogHrn.toString(),
                params.layerId,
                quadTreeIndex.parentQuads
            );
        }
    }

    return Promise.resolve(quadTreeIndex);
}
