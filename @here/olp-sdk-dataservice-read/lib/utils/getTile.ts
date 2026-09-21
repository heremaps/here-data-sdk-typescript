/*
 * Copyright (C) 2020-2026 HERE Europe B.V.
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
import {
    ParentQuad,
    Index as QuadTreeIndex
} from "@here/olp-sdk-dataservice-api/lib/query-api";
import { QuadTreeIndexCacheRepository } from "../cache/QuadTreeIndexCacheRepository";
import {
    QuadTreeIndexDepth,
    QuadTreeIndexRequest
} from "../client/QuadTreeIndexRequest";
import { QueryClient } from "../client/QueryClient";
import { TileRequest, TileRequestParams } from "../client/TileRequest";
/**
 * Parameters used to get a tile.
 */
export interface GetTileParams {
    catalogHrn: HRN;
    settings: OlpClientSettings;
    layerId: string;
    layerType: "versioned" | "volatile";
}

export interface TileResponse {
    response: Response;
    parentTileKey: TileKey | undefined;
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
): Promise<TileResponse> {
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
    );

    const depth = 4;
    const requestedTileKey = TileKey.fromRowColumnLevel(
        quadKey.row,
        quadKey.column,
        quadKey.level
    );
    const quadTreeIndexRoot = requestedTileKey.changedLevelBy(-depth);

    let quadTreeIndex: QuadTreeIndex | undefined;

    if (request.getFetchOption() !== FetchOptions.OnlineOnly) {
        const cache = new QuadTreeIndexCacheRepository(params.settings.cache);
        quadTreeIndex = cache.get({
            hrn: params.catalogHrn.toString(),
            layerId: params.layerId,
            depth,
            root: quadTreeIndexRoot,
            version: catalogVersion
        });
    }

    if (!quadTreeIndex) {
        quadTreeIndex = await fetchQuadTreeIndex({
            ...params,
            catalogVersion,
            depth,
            fetchOptions: request.getFetchOption(),
            tileKey: quadTreeIndexRoot,
            abortSignal,
            billingTag: request.getBillingTag()
        });
    }

    const subQuads = quadTreeIndex.subQuads ?? [];
    const parentQuads = quadTreeIndex.parentQuads ?? [];

    if (!subQuads.length && !parentQuads.length) {
        return Promise.resolve({
            response: new Response(null, {
                status: 204,
                statusText: "No Content"
            }),
            parentTileKey: undefined
        });
    }

    const closestParent = findClosestParent(
        requestedTileKey,
        quadTreeIndex,
        quadTreeIndexRoot
    );
    if (!closestParent) {
        return Promise.reject(
            new Error(
                `Error getting blob for Tile: ${requestedTileKey.toHereTile()}`
            )
        );
    }

    return {
        response: await BlobApi.getBlob(blobRequestBuilder, {
            dataHandle: closestParent.parentQuad.dataHandle,
            layerId: params.layerId,
            billingTag: request.getBillingTag()
        }),
        parentTileKey: closestParent.tileKey
    };
}

/**
 * Helper function to get the closest parent quad for a given tile key.
 * @hidden
 */
function findClosestParent(
    tileKey: TileKey,
    quadTreeIndex: QuadTreeIndex,
    quadTreeIndexRoot: TileKey
) {
    const subQuads = quadTreeIndex.subQuads ?? [];
    const parentQuads = quadTreeIndex.parentQuads ?? [];

    // First, iterate through the sub quad trees, starting from lowest level up to the quad tree index root
    let currentTileKey = tileKey;
    while (currentTileKey.level >= quadTreeIndexRoot.level) {
        const currentDelta = currentTileKey.level - quadTreeIndexRoot.level;
        const subHereTile = currentTileKey.getSubHereTile(currentDelta);
        const subQuad = subQuads.find(
            (item) => item.subQuadKey === subHereTile
        );

        if (subQuad) {
            return { parentQuad: subQuad, tileKey: currentTileKey };
        }

        // Stop before requesting the parent of the quad tree index root -
        // that root can be the global root tile (level 0), whose parent()
        // throws rather than returning another tile.
        if (currentTileKey.level === quadTreeIndexRoot.level) {
            break;
        }

        currentTileKey = currentTileKey.parent();
    }

    // not found? Find the closest parent quad
    return parentQuads.reduce<
        { parentQuad: ParentQuad; tileKey: TileKey } | undefined
    >((closest, parentQuad) => {
        const tileKey = TileKey.fromHereTile(parentQuad.partition);
        return !closest || tileKey.level > closest.tileKey.level
            ? { parentQuad, tileKey }
            : closest;
    }, undefined);
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

    const quadTreeIndex = await queryClient.fetchQuadTreeIndex(
        quadTreeIndexRequest,
        params.abortSignal
    );

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
