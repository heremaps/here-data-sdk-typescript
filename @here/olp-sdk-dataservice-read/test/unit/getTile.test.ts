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
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    assert
} from "vitest";
import { createStubInstance } from "./stub-instance";
import { TileRequest, getTile } from "@here/olp-sdk-dataservice-read/lib";
import * as core from "@here/olp-sdk-core";
import { BlobApi, QueryApi } from "@here/olp-sdk-dataservice-api";
import { FetchOptions } from "@here/olp-sdk-core";

describe("getTile", function () {
    const request = new TileRequest();

    let quadTreeIndexStub: any;
    let olpClientSettingsStub: any;

    let getBaseUrlRequestStub: any;
    const fakeURL = "http://fake-base.url";

    beforeAll(function () {});

    beforeEach(function () {
        olpClientSettingsStub = createStubInstance(core.OlpClientSettings);

        quadTreeIndexStub = vi
            .spyOn(QueryApi, "quadTreeIndex")
            .mockReturnValue(undefined as any);

        getBaseUrlRequestStub = vi
            .spyOn(core.RequestFactory, "getBaseUrl")
            .mockReturnValue(undefined as any);
        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.resolve(fakeURL)
        );
    });

    afterEach(function () {
        vi.restoreAllMocks();
    });

    it("Should return 204 response if no quadTreeIndex data", async function () {
        const mockedQuadKeyTreeData = {
            subQuads: [],
            parentQuads: []
        };

        quadTreeIndexStub.mockImplementation(
            (builder: any, params: any): Promise<QueryApi.Index> => {
                return Promise.resolve(mockedQuadKeyTreeData);
            }
        );

        const response = await getTile(
            new TileRequest()
                .withTileKey({ row: 0, column: 0, level: 0 })
                .withFetchOption(FetchOptions.OnlineOnly),
            {
                settings: olpClientSettingsStub as any,
                catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
                layerId: "mocked-layer-id",
                layerType: "versioned",
                catalogVersion: 123
            }
        );

        expect(response.status).eqls(204);
        expect(response.statusText).eqls("No Content");
    });

    it("Should return the blob of the requested tile", async function () {
        // The sub quad key of row 818, column 2021, level 11 within the quad
        // tree that is rooted four levels above it.
        const requestedSubQuadKey = "281";
        const mockedQuadKeyTreeData = {
            subQuads: [
                {
                    subQuadKey: requestedSubQuadKey,
                    version: 309,
                    dataHandle: "mocked-data-handle"
                }
            ],
            parentQuads: []
        };
        const mockedBlob = new Response("mocked-blob");

        quadTreeIndexStub.mockImplementation((): Promise<QueryApi.Index> =>
            Promise.resolve(mockedQuadKeyTreeData)
        );
        const getBlobStub = vi
            .spyOn(BlobApi, "getBlob")
            .mockReturnValue(Promise.resolve(mockedBlob));

        const response = await getTile(
            new TileRequest()
                .withTileKey({ row: 818, column: 2021, level: 11 })
                .withFetchOption(FetchOptions.OnlineOnly),
            {
                settings: olpClientSettingsStub as any,
                catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
                layerId: "mocked-layer-id",
                layerType: "versioned",
                catalogVersion: 123
            }
        );

        expect(response).eqls(mockedBlob);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "mocked-data-handle"
        );
    });

    it("Should reject if no quad of the tree covers the tile", async function () {
        const mockedQuadKeyTreeData = {
            subQuads: [
                {
                    subQuadKey: "unrelated-sub-quad-key",
                    version: 309,
                    dataHandle: "mocked-data-handle"
                }
            ],
            parentQuads: []
        };

        quadTreeIndexStub.mockImplementation((): Promise<QueryApi.Index> =>
            Promise.resolve(mockedQuadKeyTreeData)
        );

        // Every level from the requested tile up to the root of the tree is
        // tried before the lookup is given up on.
        await expect(
            getTile(
                new TileRequest()
                    .withTileKey({ row: 818, column: 2021, level: 11 })
                    .withFetchOption(FetchOptions.OnlineOnly),
                {
                    settings: olpClientSettingsStub as any,
                    catalogHrn: core.HRN.fromString(
                        "hrn:here:data:::mocked-hrn"
                    ),
                    layerId: "mocked-layer-id",
                    layerType: "versioned",
                    catalogVersion: 123
                }
            )
        ).rejects.toThrow(
            `Error getting blob for Tile: ${JSON.stringify({
                row: 818,
                column: 2021,
                level: 11
            })}`
        );
    });

    it("Should throw an error if not tile key", async function () {
        const tile = await getTile(request, {
            settings: olpClientSettingsStub as any,
            catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
            layerId: "mocked-layer-id",
            layerType: "versioned"
        }).catch((err) => err.message);
        assert.isTrue(tile === "Please provide correct QuadKey");
    });
});
