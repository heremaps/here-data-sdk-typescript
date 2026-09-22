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
import { QuadTreeIndexCacheRepository } from "../../lib/cache/QuadTreeIndexCacheRepository";
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

    it("Should return a 204 TileResponse when includeTileKey is true", async function () {
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
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response.status).eqls(204);
        expect(response.response.statusText).eqls("No Content");
        assert.isUndefined(response.parentTileKey);
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

    it("Should return a plain Response when includeTileKey is false or a run-time flag", async function () {
        const mockedQuadKeyTreeData = {
            subQuads: [
                {
                    subQuadKey: "281",
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
        vi.spyOn(BlobApi, "getBlob").mockReturnValue(
            Promise.resolve(mockedBlob)
        );

        const params = {
            settings: olpClientSettingsStub as any,
            catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
            layerId: "mocked-layer-id",
            layerType: "versioned" as const,
            catalogVersion: 123
        };
        const buildRequest = () =>
            new TileRequest()
                .withTileKey({ row: 818, column: 2021, level: 11 })
                .withFetchOption(FetchOptions.OnlineOnly);

        const explicitlyFalse = await getTile(
            buildRequest(),
            params,
            undefined,
            {
                includeTileKey: false
            }
        );
        expect(explicitlyFalse).eqls(mockedBlob);

        const omitted = await getTile(buildRequest(), params, undefined, {});
        expect(omitted).eqls(mockedBlob);

        // A flag only known at run time resolves to the union overload, so the
        // caller has to narrow it.
        const runtimeFlag: boolean = false;
        const dynamic = await getTile(buildRequest(), params, undefined, {
            includeTileKey: runtimeFlag
        });
        assert.instanceOf(dynamic, Response);
    });

    it("Should resolve the requested tile's own key when includeTileKey is true", async function () {
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
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response).eqls(mockedBlob);
        expect(
            response.parentTileKey?.equals(
                core.TileKey.fromRowColumnLevel(818, 2021, 11)
            )
        ).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "mocked-data-handle"
        );
    });

    it("Should return the blob of the closest parent tile from sub quads", async function () {
        const mockedQuadKeyTreeData = {
            subQuads: [
                {
                    subQuadKey: "17",
                    version: 309,
                    dataHandle: "farther-parent-data-handle"
                },
                {
                    subQuadKey: "70",
                    version: 309,
                    dataHandle: "closest-parent-data-handle"
                }
            ],
            parentQuads: []
        };
        const mockedBlob = new Response("mocked-parent-blob");

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
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response).eqls(mockedBlob);
        expect(
            response.parentTileKey?.equals(
                core.TileKey.fromRowColumnLevel(409, 1010, 10)
            )
        ).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "closest-parent-data-handle"
        );
    });

    it("Should return the blob of the closest parent tile from parent quads", async function () {
        const mockedQuadKeyTreeData = {
            subQuads: [],
            parentQuads: [
                {
                    partition: "1525",
                    version: 309,
                    dataHandle: "farther-parent-data-handle"
                },
                {
                    partition: "6103",
                    version: 309,
                    dataHandle: "closest-parent-data-handle"
                }
            ]
        };
        const mockedBlob = new Response("mocked-parent-blob");

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
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response).eqls(mockedBlob);
        expect(
            response.parentTileKey?.equals(
                core.TileKey.fromRowColumnLevel(25, 63, 6)
            )
        ).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "closest-parent-data-handle"
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
        ).rejects.toThrow("Error getting blob for Tile: 6250009");
    });

    it("Should return the blob of the closest parent tile when the requested tile is at or below the quad tree index depth", async function () {
        // The requested tile is at level 2, which is not deeper than the
        // quad tree index depth (4). This clamps the root of the quad tree
        // index to the global root tile (level 0), so walking up from the
        // requested tile reaches level 0 without ever leaving the tree.
        const mockedQuadKeyTreeData = {
            subQuads: [],
            parentQuads: [
                {
                    partition: "1",
                    version: 309,
                    dataHandle: "root-data-handle"
                }
            ]
        };
        const mockedBlob = new Response("mocked-parent-blob");

        quadTreeIndexStub.mockImplementation((): Promise<QueryApi.Index> =>
            Promise.resolve(mockedQuadKeyTreeData)
        );
        const getBlobStub = vi
            .spyOn(BlobApi, "getBlob")
            .mockReturnValue(Promise.resolve(mockedBlob));

        const response = await getTile(
            new TileRequest()
                .withTileKey({ row: 1, column: 1, level: 2 })
                .withFetchOption(FetchOptions.OnlineOnly),
            {
                settings: olpClientSettingsStub as any,
                catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
                layerId: "mocked-layer-id",
                layerType: "versioned",
                catalogVersion: 123
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response).eqls(mockedBlob);
        expect(
            response.parentTileKey?.equals(
                core.TileKey.fromRowColumnLevel(0, 0, 0)
            )
        ).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "root-data-handle"
        );
    });

    it("Should keep the already-found deepest parent quad", async function () {
        const mockedQuadKeyTreeData = {
            subQuads: [],
            parentQuads: [
                {
                    partition: "6103",
                    version: 309,
                    dataHandle: "closest-parent-data-handle"
                },
                {
                    partition: "1525",
                    version: 309,
                    dataHandle: "should-be-ignored-data-handle"
                }
            ]
        };
        const mockedBlob = new Response("mocked-parent-blob");

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
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response).eqls(mockedBlob);
        expect(
            response.parentTileKey?.equals(
                core.TileKey.fromRowColumnLevel(25, 63, 6)
            )
        ).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "closest-parent-data-handle"
        );
    });

    it("Should use the cached quad tree index instead of fetching it", async function () {
        const settings = new core.OlpClientSettings({
            environment: "here",
            getToken: () => Promise.resolve("mocked-token")
        });
        const requestedTileKey = core.TileKey.fromRowColumnLevel(818, 2021, 11);

        new QuadTreeIndexCacheRepository(settings.cache).put({
            hrn: "hrn:here:data:::mocked-hrn",
            layerId: "mocked-layer-id",
            depth: 4,
            root: requestedTileKey.changedLevelBy(-4),
            version: 123,
            tree: {
                subQuads: [
                    {
                        subQuadKey: "281",
                        version: 309,
                        dataHandle: "cached-data-handle"
                    }
                ],
                parentQuads: []
            }
        });

        const mockedBlob = new Response("cached-blob");
        const getBlobStub = vi
            .spyOn(BlobApi, "getBlob")
            .mockReturnValue(Promise.resolve(mockedBlob));

        const response = await getTile(
            new TileRequest().withTileKey(requestedTileKey),
            {
                settings,
                catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
                layerId: "mocked-layer-id",
                layerType: "versioned",
                catalogVersion: 123
            },
            undefined,
            { includeTileKey: true }
        );

        expect(quadTreeIndexStub).not.toHaveBeenCalled();
        expect(response.response).eqls(mockedBlob);
        expect(response.parentTileKey?.equals(requestedTileKey)).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "cached-data-handle"
        );
    });

    it("Should cache a quad tree index that has only parent quads", async function () {
        const settings = new core.OlpClientSettings({
            environment: "here",
            getToken: () => Promise.resolve("mocked-token")
        });
        const mockedQuadKeyTreeData = {
            parentQuads: [
                {
                    partition: "6103",
                    version: 309,
                    dataHandle: "closest-parent-data-handle"
                }
            ]
        };

        quadTreeIndexStub.mockImplementation((): Promise<QueryApi.Index> =>
            Promise.resolve(mockedQuadKeyTreeData)
        );
        vi.spyOn(BlobApi, "getBlob").mockReturnValue(
            Promise.resolve(new Response("mocked-parent-blob"))
        );

        const params = {
            settings,
            catalogHrn: core.HRN.fromString("hrn:here:data:::mocked-hrn"),
            layerId: "mocked-layer-id",
            layerType: "versioned" as const,
            catalogVersion: 123
        };
        const tileKey = { row: 818, column: 2021, level: 11 };

        await getTile(new TileRequest().withTileKey(tileKey), params);
        await getTile(new TileRequest().withTileKey(tileKey), params);

        expect(quadTreeIndexStub).toHaveBeenCalledTimes(1);
    });

    it("Should treat a missing subQuads field as an empty list", async function () {
        const mockedQuadKeyTreeData = {
            parentQuads: [
                {
                    partition: "6103",
                    version: 309,
                    dataHandle: "closest-parent-data-handle"
                }
            ]
        };
        const mockedBlob = new Response("mocked-parent-blob");

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
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response).eqls(mockedBlob);
        expect(
            response.parentTileKey?.equals(
                core.TileKey.fromRowColumnLevel(25, 63, 6)
            )
        ).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "closest-parent-data-handle"
        );
    });

    it("Should treat a missing parentQuads field as an empty list", async function () {
        const requestedSubQuadKey = "281";
        const mockedQuadKeyTreeData = {
            subQuads: [
                {
                    subQuadKey: requestedSubQuadKey,
                    version: 309,
                    dataHandle: "mocked-data-handle"
                }
            ]
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
            },
            undefined,
            { includeTileKey: true }
        );

        expect(response.response).eqls(mockedBlob);
        expect(
            response.parentTileKey?.equals(
                core.TileKey.fromRowColumnLevel(818, 2021, 11)
            )
        ).toBe(true);
        expect(getBlobStub.mock.calls[0][1].dataHandle).eqls(
            "mocked-data-handle"
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
