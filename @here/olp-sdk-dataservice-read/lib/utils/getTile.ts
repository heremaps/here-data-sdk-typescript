/*
 * Copyright (C) 2020-2021 HERE Europe B.V.
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
    FetchOptions,
    HRN,
    RequestFactory,
    TileKey,
    OlpClientSettings,
    ApiName
} from "@here/olp-sdk-core";
import { BlobApi } from "@here/olp-sdk-dataservice-api";
import { Index as QuadTreeIndex } from "@here/olp-sdk-dataservice-api/lib/query-api";
import {
    QuadTreeIndexCacheRepository,
    QuadTreeIndexDepth,
    QuadTreeIndexRequest,
    QueryClient,
    TileRequest,
    TileRequestParams
} from "@here/olp-sdk-dataservice-read";
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
 * Fetches asynchronously data from a tile or from its nearest ancestor if not found.
 *
 * The tile is a geometric area represented as a HERE tile.
 * The quad tree metadata fetches the blob of needed tile from the HERE Query Service,
 * then caches it, and returns to the user.
 * To disable caching of metadata use `request.withFetchOption(FetchOptions.OnlineOnly)`.
 *
 * @param request Requests the [[TileRequest]] instance with the configured parameters.
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
 * @returns The blob of the requested tile or the blob of the closest parent Tile.
 */
export async function getTile(
    request: TileRequest,
    params: TileRequestParams,
    abortSignal?: AbortSignal
): Promise<Response> {
    let catalogVersion: number | undefined;

    const quadKey = request.getTileKey();
    if (!quadKey) {
        return Promise.reject(new Error("Please provide correct QuadKey"));
    }

    if (params.layerType === "versioned") {
        catalogVersion = params.catalogVersion;
    }

    const blobType: ApiName =
        params.layerType === "versioned" ? "blob" : "volatile-blob";

    const blobRequestBuilder = await RequestFactory.create(
        blobType,
        "v1",
        params.settings,
        params.catalogHrn,
        abortSignal
    ).catch(error => Promise.reject(error));

    const delta = 4;
    const requestedTileKey = TileKey.fromRowColumnLevel(
        quadKey.row,
        quadKey.column,
        quadKey.level
    );

    let quadTreeIndex = null;

    if (request.getFetchOption() !== FetchOptions.OnlineOnly) {
        const cache = new QuadTreeIndexCacheRepository(params.settings.cache);

        for (let i = 1; i <= delta; i++) {
            const parentInCache = requestedTileKey.changedLevelBy(-i);
            const cachedTree = cache.get({
                hrn: params.catalogHrn.toString(),
                layerId: params.layerId,
                depth: delta,
                root: parentInCache,
                version: catalogVersion
            });

            if (cachedTree) {
                quadTreeIndex = cachedTree;
            }
        }
    }

    const parentTileKey = requestedTileKey.changedLevelBy(-delta);

    if (!quadTreeIndex) {
        quadTreeIndex = await fetchQuadTreeIndex({
            ...params,
            catalogVersion,
            depth: delta,
            fetchOptions: request.getFetchOption(),
            tileKey: parentTileKey,
            abortSignal,
            billingTag: request.getBillingTag()
        }).catch(e => Promise.reject(e));
    }

    if (!quadTreeIndex.subQuads || !quadTreeIndex.subQuads.length) {
        return Promise.resolve(
            new Response("No Content", {
                status: 204,
                statusText: "No Content"
            })
        );
    }

    // Return the data for the requested QuadKey or for the closest parent
    const subQuads = quadTreeIndex.subQuads;

    let currentTileKey = requestedTileKey;
    let currentDelta = delta;
    for (
        let level = currentTileKey.level;
        level >= parentTileKey.level;
        --level
    ) {
        const metadata = subQuads.find(
            item =>
                item.subQuadKey === currentTileKey.getSubHereTile(currentDelta)
        );

        if (metadata) {
            return BlobApi.getBlob(blobRequestBuilder, {
                dataHandle: metadata.dataHandle,
                layerId: params.layerId,
                billingTag: request.getBillingTag()
            });
        }

        try {
            currentTileKey = currentTileKey.parent();
            currentDelta = parentTileKey.level - currentTileKey.level;
        } catch (error) {
            continue;
        }
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
        tileKey: TileKey;
        depth: QuadTreeIndexDepth;
        fetchOptions: FetchOptions;
        catalogVersion?: number;
        billingTag?: string;
        abortSignal?: AbortSignal;
    }
): Promise<QuadTreeIndex> {
    const cache = new QuadTreeIndexCacheRepository(params.settings.cache);
    const queryClient = new QueryClient(params.settings);

    const quadTreeIndexRequest = new QuadTreeIndexRequest(
        params.catalogHrn,
        params.layerId,
        params.layerType
    )
        .withQuadKey(params.tileKey)
        .withDepth(params.depth);

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
        cache.put({
            hrn: params.catalogHrn.toString(),
            layerId: params.layerId,
            depth: params.depth,
            root: params.tileKey,
            tree: quadTreeIndex,
            version: params.catalogVersion
        });
    }

    return Promise.resolve(quadTreeIndex);
}
