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
import { BlobApi } from "@here/olp-sdk-dataservice-api";
import {
    FetchOptions,
    MetadataCacheRepository,
    mortonCodeFromQuadKey,
    PartitionsRequest,
    QuadTreeIndexRequest,
    QueryClient,
    RequestFactory,
    TileRequest
} from "..";

/**
 * Gets the tile by the key (A geometric area represented as a HERE tile).
 *
 * The quadTree metadata fetch from the Query service,
 * then caches and returns to the user the blob of needed tile.
 * To disable caching of metadata use request.withFetchOption(FetchOptions.OnlineOnly).
 *
 * @param rq Request instance with configured params. @see [[TileRequest]]
 *
 * @param abortSignal a signal object that allows you to communicate with a request (such as the `fetch` request)
 * and, if required, abort it using the `AbortController` object.
 *
 * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
 *
 * @example
 *
 * ```
 *  const params: TileRequestParams = {
 *       settings: "% your OlpClientSettings instance % ",
 *       catalogHrn: "% HRN instance of your catalog %",
 *       layerId: "% Id of your layer %",
 *       layerType: "% versioned or volatile %",
 *       catalogVersion: "% the version of catalog, the latest version will be using by default for versioned layer %"
 *   }
 *
 *  const request = new TileRequest(params);
 *
 *  const tile1 = await getTile(request.withTileKey(yourTileKey1));
 *  const tile2 = await getTile(request.withTileKey(yourTileKey2));
 *
 * ```
 *
 * @returns Response with blob of the tile
 */
export async function getTile(
    rq: TileRequest,
    abortSignal?: AbortSignal
): Promise<Response> {
    const layerType = rq.getParams().layerType;
    const settings = rq.getParams().settings;
    const catalogHrn = rq.getParams().catalogHrn;
    const layerId = rq.getParams().layerId;
    const billingTag = rq.getBillingTag();
    const quadKey = rq.getTileKey();
    const fetchOptions = rq.getFetchOption();
    const cache = new MetadataCacheRepository(settings.cache);

    if (!quadKey) {
        return Promise.reject(new Error("Please provide correct QuadKey"));
    }

    const partitionId = `${mortonCodeFromQuadKey(quadKey)}`;
    const partitionsRequest = new PartitionsRequest().withPartitionIds([
        partitionId
    ]);

    const blobType = layerType === "versioned" ? "blob" : "volatile-blob";
    const queryClient = new QueryClient(settings);
    const blobRequestBuilder = await RequestFactory.create(
        blobType,
        "v1",
        settings,
        catalogHrn,
        abortSignal
    ).catch(error => Promise.reject(error));

    if (fetchOptions !== FetchOptions.OnlineOnly) {
        const cachedPartition = cache.get(
            partitionsRequest,
            catalogHrn.toString(),
            layerId
        );

        if (cachedPartition) {
            return BlobApi.getBlob(blobRequestBuilder, {
                dataHandle: cachedPartition[0].dataHandle,
                layerId,
                billingTag
            });
        }
    }

    const quadTreeIndexRequest = new QuadTreeIndexRequest(
        catalogHrn,
        layerId,
        layerType
    ).withQuadKey(quadKey);

    if (layerType === "versioned") {
        const catalogVersion = await rq
            .getCatalogVersion()
            .catch(err => Promise.reject(err));
        quadTreeIndexRequest.withVersion(catalogVersion);
    }

    const quadTreeIndex = await queryClient
        .fetchQuadTreeIndex(quadTreeIndexRequest, abortSignal)
        .catch(err => Promise.reject(err));

    if (!quadTreeIndex || !quadTreeIndex.subQuads) {
        return Promise.reject(new Error("Error fetching QuadTreeIndex"));
    }

    if (
        quadTreeIndex &&
        quadTreeIndex.subQuads &&
        quadTreeIndex.subQuads.length
    ) {
        if (fetchOptions !== FetchOptions.OnlineOnly) {
            cache.put(partitionsRequest, catalogHrn.toString(), layerId, [
                {
                    partition: partitionId,
                    dataHandle: quadTreeIndex.subQuads[0].dataHandle,
                    version: quadTreeIndex.subQuads[0].version
                }
            ]);

            if (quadTreeIndex.parentQuads && quadTreeIndex.parentQuads.length) {
                cache.put(
                    partitionsRequest,
                    catalogHrn.toString(),
                    layerId,
                    quadTreeIndex.parentQuads
                );
            }
        }

        return BlobApi.getBlob(blobRequestBuilder, {
            dataHandle: quadTreeIndex.subQuads[0].dataHandle,
            layerId,
            billingTag
        });
    }

    return Promise.reject(
        new Error(`Error getting blob for Tile: ${JSON.stringify(quadKey)}`)
    );
}
