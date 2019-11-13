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

import { assert } from "chai";
import sinon = require("sinon");

import {
    DownloadManager,
    DataStoreDownloadManager,
    HRN,
    OlpClientSettings,
    VolatileLayerClient,
    PartitionsRequest,
    quadKeyFromMortonCode,
    mortonCodeFromQuadKey
} from "@here/olp-sdk-dataservice-read";

function createMockDownloadResponse(resp: Object, blob?: string) {
    const headers = new Headers();
    headers.append("etag", "1237696a7c876b7e");
    headers.append("content-type", blob || "application/json");
    const mock = {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headers,
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

// NewvolatileLayerClient

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
    "https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::live-weather-na/apis",
    [
        {
            api: "blob",
            version: "v1",
            baseURL:
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "index",
            version: "v1",
            baseURL:
                "https://index.data.api.platform.here.com/index/v1/catalogs/hrn:here:data:::live-weather-na",
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
                "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "notification",
            version: "v2",
            baseURL:
                "https://sub.data.api.platform.here.com/notification/v2/catalogs/hrn:here:data:::live-weather-na",
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
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "statistics",
            version: "v1",
            baseURL:
                "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::live-weather-na",
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
    "https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::live-weather-na/apis/query/v1",
    [
        {
            api: "blob",
            version: "v1",
            baseURL:
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "index",
            version: "v1",
            baseURL:
                "https://index.data.api.platform.here.com/index/v1/catalogs/hrn:here:data:::live-weather-na",
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
                "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "notification",
            version: "v2",
            baseURL:
                "https://sub.data.api.platform.here.com/notification/v2/catalogs/hrn:here:data:::live-weather-na",
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
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "statistics",
            version: "v1",
            baseURL:
                "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::live-weather-na",
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
    "https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::live-weather-na/apis/blob/v1",
    [
        {
            api: "blob",
            version: "v1",
            baseURL:
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "index",
            version: "v1",
            baseURL:
                "https://index.data.api.platform.here.com/index/v1/catalogs/hrn:here:data:::live-weather-na",
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
                "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "notification",
            version: "v2",
            baseURL:
                "https://sub.data.api.platform.here.com/notification/v2/catalogs/hrn:here:data:::live-weather-na",
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
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "statistics",
            version: "v1",
            baseURL:
                "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::live-weather-na",
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
    "https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::live-weather-na/apis/metadata/v1",
    [
        {
            api: "blob",
            version: "v1",
            baseURL:
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "index",
            version: "v1",
            baseURL:
                "https://index.data.api.platform.here.com/index/v1/catalogs/hrn:here:data:::live-weather-na",
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
                "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "notification",
            version: "v2",
            baseURL:
                "https://sub.data.api.platform.here.com/notification/v2/catalogs/hrn:here:data:::live-weather-na",
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
                "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na",
            parameters: {}
        },
        {
            api: "statistics",
            version: "v1",
            baseURL:
                "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::live-weather-na",
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
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/quadkeys/75717/depths/4",
    {
        partitions: [
            {
                dataHandle: "43d76b9f-e934-40e5-9ce4-91d88a30f1c6",
                layer: "latest-data",
                partition: "75717",
                version: 0
            }
        ]
    }
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/partitions?partition=75717",
    {
        partitions: [
            {
                dataHandle: "43d76b9f-e934-40e5-9ce4-91d88a30f1c6",
                layer: "latest-data",
                partition: "75717",
                version: 0
            }
        ]
    }
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/partitions",
    {
        partitions: [
            {
                version: 12,
                partition: "269",
                layer: "latest-data",
                dataHandle: "ddb5a905-b5cb-406a-b048-1d10acb2a826"
            },
            {
                version: 12,
                partition: "270",
                layer: "latest-data",
                dataHandle: "8fd3d6a9-52ce-4465-a256-17d674b93e8a"
            },
            {
                version: 12,
                partition: "3",
                layer: "latest-data",
                dataHandle: "data:SomethingBaH!"
            }
        ]
    }
);
const headersMock = new Headers();
headersMock.append("etag", "1237696a7c876b7e");

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::sensor-data-sensoris-versioned-example/layers/protobuf-example-berlin-v1/versions/0/quadkeys/23618359/depths/4",
    {
        subQuads: [
            {
                version: 0,
                subQuadKey: "1",
                dataHandle: "2d50139b-01a9-4ed1-a40e-784416d46c33"
            }
        ],
        parentQuads: []
    }
);
// https://blob.data.api.platform.here.com/blobstore/
urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/quadkeys/5766/depths/4",
    {
        subQuads: [
            {
                version: 12,
                subQuadKey: "307",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            }
        ],
        parentQuads: []
    }
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/quadkeys/23064/depths/4",
    {
        subQuads: [
            {
                version: 12,
                subQuadKey: "1",
                dataHandle: "c9116bb9-7d00-44bf-9b26-b4ab4c274665"
            }
        ],
        parentQuads: [
            {
                version: 12,
                partition: "5904591",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            }
        ]
    }
);

urlToResponses.set(
    "https://volatile-blob.data.api.platform.here.com/blobstore/v1/catalogs/rib-2/layers/latest-data/data/da51785a-54b0-40cd-95ac-760f56fe5457",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        json: sinon.stub().returns("DT_1_1001"),
        text: sinon.stub().returns("DT_1_1001")
    }
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/quadkeys/1/depths/4",
    createMockDownloadResponse({
        subQuads: [],
        parentQuads: []
    })
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/data/43d76b9f-e934-40e5-9ce4-91d88a30f1c6",
    createMockDownloadResponse("DT_1_1010", "image/jpeg")
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/data/da51785a-54b0-40cd-95ac-760f56fe5457",
    createMockDownloadResponse("DT_1_1010", "image/jpeg")
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/data/edac817d-1e62-464b-9e0f-79ea3694933d",
    {
        type: "aaa",
        status: 204,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        json: sinon.stub().returns("DT_1_1000"),
        text: sinon.stub().returns("DT_1_1000")
    }
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665",
    {
        type: "aaa",
        status: 304,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        json: sinon.stub().returns("DT_1_1010"),
        text: sinon.stub().returns("DT_1_1010")
    }
);

urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::live-weather-na/layers/latest-data/quadkeys/92259/depths/4",
    {
        subQuads: [
            {
                version: 12,
                subQuadKey: "19",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            },
            {
                version: 12,
                subQuadKey: "79",
                dataHandle: "edac817d-1e62-464b-9e0f-79ea3694933d"
            },
            {
                version: 12,
                subQuadKey: "311",
                dataHandle: "c9116bb9-7d00-44bf-9b26-b4ab4c274665"
            },
            {
                version: 12,
                subQuadKey: "316",
                dataHandle: "541a3304-3bfe-4625-9898-29ea4869b052"
            },
            {
                version: 12,
                subQuadKey: "317",
                dataHandle: "448495fc-5359-467a-8a12-4179c0c56b25"
            },
            {
                version: 12,
                subQuadKey: "318",
                dataHandle: "e91a7396-c23b-46f5-9d70-6534c41c71f1"
            },
            {
                version: 12,
                subQuadKey: "319",
                dataHandle: "b49c283d-e234-469b-aa87-2e11edb17ce4"
            }
        ],
        parentQuads: []
    }
);

urlToResponses.set(
    "https://volatile-blob.data.api.platform.here.com/blobstore/v1/catalogs/rib-2/layers/latest-data/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665",
    {
        type: "aaa",
        status: 304,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        json: sinon.stub().returns("DT_1_1000"),
        text: sinon.stub().returns("DT_1_1000")
    }
);

urlToResponses.set(
    "https://volatile-blob.data.api.platform.here.com/blobstore/v1/catalogs/rib-2/layers/latest-data/data/edac817d-1e62-464b-9e0f-79ea3694933d",
    {
        type: "aaa",
        status: 204,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        json: sinon.stub().returns(""),
        text: sinon.stub().returns("")
    }
);

urlToResponses.set(
    "https://volatile-blob.data.api.platform.here.com/blobstore/v1/catalogs/rib-2/layers/latest-data/data/43d76b9f-e934-40e5-9ce4-91d88a30f1c6",
    createMockDownloadResponse("DT_1_1010")
);

// NewCatalogClientOffline #downloadData
urlToResponses.set(
    "https://metadata.data.api.platform.here.com/downloadData/121",
    {
        partitions: [
            {
                version: 12,
                partition: "269",
                layer: "testlayer",
                dataHandle: "ddb5a905-b5cb-406a-b048-1d10acb2a826"
            }
        ]
    }
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

// volatileLayerClient

describe("volatileLayerClient", () => {
    let volatileLayerClient: VolatileLayerClient;

    before(async () => {
        const testHRN = "hrn:here:data:::live-weather-na";
        const newPromise = () => Promise.resolve("7534286159");

        const settings = new OlpClientSettings({
            getToken: newPromise,
            environment: "here",
            dm: createMockDownloadManager()
        });

        assert.isNotNull(settings);
        volatileLayerClient = await new VolatileLayerClient(
            HRN.fromString(testHRN),
            "latest-data",
            settings as any
        );
        assert.isNotNull(volatileLayerClient);
    });

    it("#getPartition", async () => {
        let response = await volatileLayerClient.getPartition("75717");
        assert.isNotNull(response);

        let buf = await response.text();
        assert.strictEqual(buf, "DT_1_1010");
    });

    it("#getTile", async () => {
        let response = await volatileLayerClient.getTile(
            quadKeyFromMortonCode("1476147")
        );
        assert.isNotNull(response);
        assert.isTrue(response.ok);

        let buf = await response.text();
        assert.strictEqual(buf, "DT_1_1010");
    });

    it("#getTiles", async () => {
        const results = await Promise.all([
            volatileLayerClient.getTile(quadKeyFromMortonCode("1476147")),
            volatileLayerClient.getTile(quadKeyFromMortonCode("1476147"))
        ]);

        const contents = await Promise.all([
            results[0].text(),
            results[1].text()
        ]);

        assert.deepEqual(contents, ["DT_1_1010", "DT_1_1010"]);
    });

    it("#getMissingTile", async () => {
        let response = await volatileLayerClient.getTile(
            quadKeyFromMortonCode("0000")
        );
        assert.isNotNull(response);
        assert.isTrue(response.ok);
        assert.isTrue(response.status == 204);
        assert.isTrue(response.statusText == "No Content");
    });

    it("#getTileWithETag", async () => {
        const response = await volatileLayerClient.getTile(
            quadKeyFromMortonCode("1476147")
        );
        assert.isNotNull(response);
        assert.isTrue(response.ok);
        const etag = response.headers.get("etag");
        assert.isDefined(etag);
        if (etag === null) {
            return;
        } // no etag received - skip test

        const buf = await response.text();
        assert.strictEqual(buf, "DT_1_1010");

        const cachedResponse = await volatileLayerClient.getTile(
            quadKeyFromMortonCode("23618359")
        );
        // make sure status is 304 - not modified
        assert.strictEqual(cachedResponse.status, 304);
    });

    it("#getAggregatedTile", async () => {
        const aggregatedResponse = await volatileLayerClient.getAggregatedTile(
            quadKeyFromMortonCode("5904591")
        );
        assert.isTrue(aggregatedResponse.ok);
        assert.isDefined(aggregatedResponse.quadKey);
        if (aggregatedResponse.quadKey !== undefined) {
            assert.strictEqual(
                mortonCodeFromQuadKey(aggregatedResponse.quadKey),
                5904591
            );
        }
    });

    it("#abortGetPartition", async () => {
        const abortController = new AbortController();
        const init = { signal: abortController.signal };
        const responsePromise = await volatileLayerClient.getPartition(
            "75717",
            init
        );
        abortController.abort();
        try {
            await responsePromise;
        } catch (err) {
            assert.isTrue(err instanceof Error);
            assert.strictEqual(err.name, "AbortError");
        }
        assert.isTrue(init.signal.aborted);
    });

    it("#getIndexMetadata", async () => {
        let index = await volatileLayerClient.getIndexMetadata(
            quadKeyFromMortonCode("75717")
        );
        assert.isDefined(index);
    });

    it("#getPartitions", async () => {
        const partitionsRequest = new PartitionsRequest();
        const partitions = (await volatileLayerClient.getPartitions(
            partitionsRequest as any
        )) as any;
        assert.isDefined(partitions);
        assert.isAbove(partitions.partitions.length, 0, "index is empty");
    });
});
