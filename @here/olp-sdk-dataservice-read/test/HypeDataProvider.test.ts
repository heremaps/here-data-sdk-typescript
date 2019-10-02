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

import * as utils from "../lib/partitioning/QuadKeyUtils";
import { assert } from "chai";
import sinon = require("sinon");
import { HRN } from "../lib/HRN";
import { HypeDataProvider } from "../lib/HypeDataProvider";
import { DataStoreDownloadManager } from "../lib/DataStoreDownloadManager";
import { DownloadManager } from "../lib/DownloadManager";

function createMockDownloadResponse(resp: Object) {
    const mock = {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: new Headers().append("etag", "1237696a7c876b7e"),
        arrayBuffer: sinon.stub().returns(resp),
        json: sinon.stub().returns(resp),
        text: sinon.stub().returns(resp)
    };
    return mock;
}

/**
 * urlToResponses is a map of possible requests for tiles or metadata.
 * The response URL is the map's key and a corresponding response for each url is the value.
 */
const urlToResponses = new Map<string, any>();

urlToResponses.set(
    "https://api-lookup.data.api.platform.here.com/lookup/v1/platform/apis",
    [
        {
            api: "account",
            version: "v1",
            baseURL: "https://account.api.here.com",
            parameters: {}
        },
        {
            api: "account",
            version: "v1.1",
            baseURL: "https://account.api.here.com/authorization/v1.1",
            parameters: {}
        },
        {
            api: "artifact",
            version: "v1",
            baseURL: "https://artifact.api.platform.here.com/v1",
            parameters: {}
        },
        {
            api: "config",
            version: "v1",
            baseURL: "https://config.data.api.platform.here.com/config/v1",
            parameters: {}
        },
        {
            api: "lookup",
            version: "v1",
            baseURL: "https://api-lookup.data.api.platform.here.com/lookup/v1",
            parameters: {}
        },
        {
            api: "marketplace",
            version: "v1",
            baseURL: "https://marketplace.api.platform.here.com/api/v1",
            parameters: {}
        },
        {
            api: "pipelines",
            version: "v2",
            baseURL: "https://pipelines.api.platform.here.com/pipeline-service",
            parameters: {}
        }
    ]
);

urlToResponses.set(
    "https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::rib-2/apis",
    [
        {
            api: "blob",
            version: "v1",
            baseURL:
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::rib-2",
            parameters: {}
        },
        {
            api: "index",
            version: "v1",
            baseURL:
                "https://index.data.api.platform.here.com/index/v1/catalogs/hrn:here:data:::rib-2",
            parameters: {}
        },
        {
            api: "ingest",
            version: "v1",
            baseURL:
                "https://ingest.data.api.platform.here.com/ingest/v1/catalogs/rib-2",
            parameters: {}
        },
        {
            api: "metadata",
            version: "v1",
            baseURL:
                "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::rib-2",
            parameters: {}
        },
        {
            api: "notification",
            version: "v2",
            baseURL:
                "https://sub.data.api.platform.here.com/notification/v2/catalogs/hrn:here:data:::rib-2",
            parameters: {}
        },
        {
            api: "publish",
            version: "v1",
            baseURL:
                "https://publish.data.api.platform.here.com/publish/v1/catalogs/rib-2",
            parameters: {}
        },
        {
            api: "publish",
            version: "v2",
            baseURL:
                "https://publish.data.api.platform.here.com/publish/v2/catalogs/rib-2",
            parameters: {}
        },
        {
            api: "query",
            version: "v1",
            baseURL:
                "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2",
            parameters: {}
        },
        {
            api: "statistics",
            version: "v1",
            baseURL:
                "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::rib-2",
            parameters: {}
        },
        {
            api: "stream",
            version: "v2",
            baseURL:
                "https://web.streaming.data.api.platform.here.com/stream/v2/catalogs/rib-2",
            parameters: {}
        },
        {
            api: "volatile-blob",
            version: "v1",
            baseURL:
                "https://volatile-blob.data.api.platform.here.com/blobstore/v1/catalogs/rib-2",
            parameters: {}
        }
    ]
);

urlToResponses.set(
    "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::rib-2/versions/latest?startVersion=-1",
    {
        version: 2
    }
);

urlToResponses.set(
    "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::rib-2/layerVersions?version=2",
    {
        version: 2,
        layerVersions: [
            {
                layer: "hype-test-prefetch",
                version: 2,
                timestamp: 1544032618375
            },
            {
                layer: "testlayer_res",
                version: 2,
                timestamp: 1544032618375
            }
        ]
    }
);

urlToResponses.set(
    "https://config.data.api.platform.here.com/config/v1/catalogs/hrn:here:data:::rib-2",
    {
        id: "here-internal-test",
        hrn: "hrn:here-dev:data:::here-internal-test",
        name: "here-internal-test",
        summary: "Internal test for here",
        description: "Used for internal testing on the staging olp.",
        contacts: {},
        owner: {
            creator: {
                id: "HERE-88c95a7e-4123-4dcd-ae0e-4682aa5c3db4"
            },
            organisation: {
                id: "olp-here"
            }
        },
        tags: [],
        billingTags: [],
        created: "2018-07-13T20:50:08.425Z",
        replication: {
            regions: [
                {
                    id: "eu-ireland",
                    role: "primary"
                }
            ]
        },
        layers: [
            {
                id: "hype-test-prefetch",
                hrn:
                    "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                name: "Hype Test Prefetch",
                summary: "hype prefetch testing",
                description: "Layer for hype prefetch testing",
                coverage: {
                    adminAreas: []
                },
                owner: {
                    creator: {
                        id: "HERE-88c95a7e-4123-4dcd-ae0e-4682aa5c3db4"
                    },
                    organisation: {
                        id: "olp-here"
                    }
                },
                partitioningScheme: "heretile",
                partitioning: {
                    tileLevels: [],
                    scheme: "heretile"
                },
                contentType: "application/x-protobuf",
                volume: {
                    volumeType: "durable"
                },
                tags: [],
                billingTags: [],
                created: "2018-07-13T20:56:19.181Z",
                layerType: "versioned"
            },
            {
                id: "testlayer_res",
                hrn: "hrn:here-dev:data:::here-internal-test:testlayer_res",
                name: "Resource Test Layer",
                summary: "testlayer_res",
                description: "testlayer_res",
                coverage: {
                    adminAreas: []
                },
                owner: {
                    creator: {
                        id: "HERE-88c95a7e-4123-4dcd-ae0e-4682aa5c3db4"
                    },
                    organisation: {
                        id: "olp-here"
                    }
                },
                partitioningScheme: "generic",
                partitioning: {
                    scheme: "generic"
                },
                contentType: "application/x-protobuf",
                volume: {
                    volumeType: "durable"
                },
                tags: ["TEST"],
                billingTags: [],
                created: "2018-07-13T20:56:19.181Z",
                layerType: "versioned",
                schema: {
                    hrn: "hrn:here:schema:::dummy_schema:1.0.3"
                }
            }
        ],
        marketplaceReady: false,
        version: 2
    }
);

const headersMock = new Headers();
headersMock.append("etag", "1237696a7c876b7e");

// #getTile
urlToResponses.set(
    "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/versions/2/quadkeys/92259/depths/4",
    {
        subQuads: [
            {
                version: 2,
                subQuadKey: "19",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            },
            {
                version: 2,
                subQuadKey: "79",
                dataHandle: "edac817d-1e62-464b-9e0f-79ea3694933d"
            },
            {
                version: 2,
                subQuadKey: "311",
                dataHandle: "c9116bb9-7d00-44bf-9b26-b4ab4c274665"
            }
        ],
        parentQuads: []
    }
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665",
    {
        type: "aaa",
        status: 304,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub().returns("DT_1_1000"),
        json: sinon.stub().returns("DT_1_1000"),
        text: sinon.stub().returns("DT_1_1000")
    }
);

// #getMissingTile
urlToResponses.set(
    "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/versions/2/quadkeys/1/depths/4",
    createMockDownloadResponse({
        subQuads: [],
        parentQuads: []
    })
);

/**
 * Mocked `DownloadManager` returns values from the `urlToResponses` map. `urlToResponses` connects
 * URLs with their corresponding and expected responses.
 * Mocked `DownloadManager` throws an assertion error when an unspecified URL is called which can
 * indicate that the expected behaviour has changed.
 */
function createMockDownloadManager(): DownloadManager {
    const downloadMgr = sinon.createStubInstance(DataStoreDownloadManager);

    downloadMgr.download.callsFake((url: string, init?: RequestInit) => {
        const resp = urlToResponses.get(url);

        if (init && init.signal && init.signal.aborted) {
            const err = new Error();
            err.name = "AbortError";
            return Promise.reject(err);
        }
        assert(resp, "Unrecognized url called: " + url);
        return Promise.resolve(
            resp.ok ? resp : createMockDownloadResponse(resp)
        );
    });

    return downloadMgr as any;
}

xdescribe("HypeDataProviderOffline", () => {
    let hypeDataProvider: HypeDataProvider;
    const testHRN = HRN.fromString("hrn:here:data:::rib-2");
    const newPromise = () => Promise.resolve("7534286159");

    beforeEach(async () => {
        hypeDataProvider = new HypeDataProvider({
            layer: "hype-test-prefetch",
            catalogVersion: 2,
            getBearerToken: newPromise,
            hrn: testHRN,
            downloadManager: createMockDownloadManager()
        });
        assert.isNotNull(hypeDataProvider);
    });

    it("#connectTest", async () => {
        await hypeDataProvider.connect();
        assert.isTrue(hypeDataProvider.ready());
    });

    it("#getCatalogClientTest", async () => {
        await hypeDataProvider.connect();
        let catalogClient = await hypeDataProvider.catalogClient();
        assert.isNotNull(catalogClient);
        assert.isDefined(catalogClient);
    });

    it("#getTileTest", async () => {
        await hypeDataProvider.connect();
        const tile = utils.quadKeyFromMortonCode("23618359");
        let response = await hypeDataProvider.getTile(tile);

        assert.isNotNull(response);
        assert.equal("DT_1_1000", response.toString());
    });

    it("#getTileNegativeTest", async () => {
        var caught = false;
        try {
            let response = await hypeDataProvider.getTile(
                utils.quadKeyFromMortonCode("23618359")
            );
        } catch (err) {
            assert.isTrue(err instanceof Error);
            assert.strictEqual(
                (err as Error).message,
                "Hype data provider not connected"
            );
            caught = true;
        }
        assert.isTrue(caught);
    });

    it("#getMissingTileTest", async () => {
        await hypeDataProvider.connect();
        const tile = utils.quadKeyFromMortonCode("0");
        let response = await hypeDataProvider.getTile(tile);

        assert.isNotNull(response);
        assert.equal(0, response.byteLength);
    });
});
