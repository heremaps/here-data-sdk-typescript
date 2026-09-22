/*
 * Copyright (C) 2026 HERE Europe B.V.
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
    afterEach,
    assert,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";
import {
    getTile,
    TileRequest,
    TileResponse
} from "@here/olp-sdk-dataservice-read";
import { BlobApi, QueryApi } from "@here/olp-sdk-dataservice-api";
import {
    FetchOptions,
    HRN,
    OlpClientSettings,
    RequestFactory,
    TileKey
} from "@here/olp-sdk-core";

// getTile() is re-exported from the package root, so it is public API even
// though it is mostly used internally by VersionedLayerClient and
// VolatileLayerClient. These tests guard its call signature and return
// shape against an accidental breaking change, such as the three-argument
// call silently starting to resolve something other than a plain Response.
describe("getTile", function () {
    const settings = new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
    });
    const catalogHrn = HRN.fromString("hrn:here:data:::mocked-hrn");
    // The sub quad key of row 818, column 2021, level 11 within the quad
    // tree that is rooted four levels above it.
    const requestedSubQuadKey = "281";

    beforeEach(function () {
        vi.spyOn(RequestFactory, "getBaseUrl").mockImplementation(() =>
            Promise.resolve("http://fake-base.url")
        );
        vi.spyOn(QueryApi, "quadTreeIndex").mockImplementation(
            (): Promise<QueryApi.Index> =>
                Promise.resolve({
                    subQuads: [
                        {
                            subQuadKey: requestedSubQuadKey,
                            version: 1,
                            dataHandle: "mocked-data-handle"
                        }
                    ],
                    parentQuads: []
                })
        );
        vi.spyOn(BlobApi, "getBlob").mockReturnValue(
            Promise.resolve(new Response("mocked-blob"))
        );
    });

    afterEach(function () {
        vi.restoreAllMocks();
    });

    function tileRequest(): TileRequest {
        return new TileRequest()
            .withTileKey({ row: 818, column: 2021, level: 11 })
            .withFetchOption(FetchOptions.OnlineOnly);
    }

    it("Should resolve a plain Response with the three-argument call", async function () {
        const response = await getTile(tileRequest(), {
            settings,
            catalogHrn,
            layerId: "mocked-layer-id",
            layerType: "versioned",
            catalogVersion: 123
        });

        assert.instanceOf(response, Response);
        assert.isUndefined((response as any).parentTileKey);
        expect((await response.blob()).size).to.be.greaterThan(0);
    });

    it("Should still accept an abortSignal as the third argument", async function () {
        const abortController = new AbortController();

        const response = await getTile(
            tileRequest(),
            {
                settings,
                catalogHrn,
                layerId: "mocked-layer-id",
                layerType: "versioned",
                catalogVersion: 123
            },
            abortController.signal
        );

        assert.instanceOf(response, Response);
    });

    it("Should resolve a TileResponse when includeTileKey is true", async function () {
        const response: TileResponse = await getTile(
            tileRequest(),
            {
                settings,
                catalogHrn,
                layerId: "mocked-layer-id",
                layerType: "versioned",
                catalogVersion: 123
            },
            undefined,
            { includeTileKey: true }
        );

        assert.instanceOf(response.response, Response);
        expect(
            response.parentTileKey?.equals(
                TileKey.fromRowColumnLevel(818, 2021, 11)
            )
        ).to.be.equal(true);
    });
});
