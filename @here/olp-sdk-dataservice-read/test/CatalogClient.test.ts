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

import "@here/olp-sdk-fetch";

import { assert } from "chai";
import sinon = require("sinon");

import { CatalogClient } from "../lib/CatalogClient";
import { DownloadManager } from "../lib/DownloadManager";
import { DataStoreDownloadManager } from "../lib/DataStoreDownloadManager";
import { HRN } from "../lib/HRN";
import { DataStoreContext } from "../lib/DataStoreContext";
import { CatalogLayer } from "../lib/CatalogLayer";

function createMockDownloadResponse(resp: Object) {
    const headers = new Headers();
    headers.append("etag", "1237696a7c876b7e");
    headers.append("content-type", "application/json");
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

// NewCatalogClient

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
        version: 12
    }
);

urlToResponses.set(
    "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::rib-2/versions?startVersion=-1&endVersion=12",
    {
        versions: [
            {
                version: 0,
                timestamp: 1531776863344,
                timeToLive: 0,
                partitionCounts: {
                    "hype-test-prefetch": 7,
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    testlayer_res: 1
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 1,
                timestamp: 1531780252105,
                timeToLive: 0,
                partitionCounts: {
                    "hype-test-prefetch": 7,
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    testlayer_res: 1
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 2,
                timestamp: 1532455489889,
                timeToLive: 0,
                partitionCounts: {
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 3,
                timestamp: 1543022077792,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 4,
                timestamp: 1543023202816,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 5,
                timestamp: 1543031837309,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 6,
                timestamp: 1543032100211,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 7,
                timestamp: 1543032899619,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 8,
                timestamp: 1543261519800,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 9,
                timestamp: 1543271519176,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 10,
                timestamp: 1543363009076,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 11,
                timestamp: 1543364786130,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 12,
                timestamp: 1544032618375,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            }
        ]
    }
);

urlToResponses.set(
    "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::rib-2/layerVersions?version=12",
    {
        version: 12,
        layerVersions: [
            {
                layer: "hype-test-prefetch",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "testlayer_res",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "testlayer",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "multilevel_testlayer",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "hype-test-prefetch-2",
                version: 12,
                timestamp: 1544032618375
            }
        ]
    }
);

// NewCatalogClientOffline - config catalog
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
            },
            {
                id: "testlayer",
                hrn: "hrn:here-dev:data:::here-internal-test:testlayer",
                name: "Test Layer",
                summary: "A test layer",
                description: "A simple test layer",
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
                layerType: "versioned"
            },
            {
                id: "multilevel_testlayer",
                hrn:
                    "hrn:here-dev:data:::here-internal-test:multilevel_testlayer",
                name: "Multi Level Test Layer",
                summary: "Multi Level Test Layer",
                description: "A multi level test layer just for testing",
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
                layerType: "versioned"
            },
            {
                id: "hype-test-prefetch-2",
                hrn:
                    "hrn:here-dev:data:::here-internal-test:hype-test-prefetch-2",
                name: "Hype Test Prefetch2",
                summary: "Layer for testing hype2 prefetching",
                description: "Layer for testing hype2 prefetching",
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
                tags: ["TEST"],
                billingTags: [],
                created: "2018-07-24T17:52:23.818Z",
                layerType: "versioned"
            }
        ],
        marketplaceReady: false,
        version: 3
    }
);

// Catalog2Client
urlToResponses.set(
    "https://metadata.data.api.platform.in.here.com/metadata/v1/catalogs/here-internal-test/versions/latest?startVersion=-1",
    {
        version: 12
    }
);

urlToResponses.set(
    "https://metadata.data.api.platform.in.here.com/metadata/v1/catalogs/here-internal-test/versions?startVersion=-1&endVersion=-1",
    {
        versions: [
            {
                version: 0,
                timestamp: 1531776863344,
                timeToLive: 0,
                partitionCounts: {
                    "hype-test-prefetch": 7,
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    testlayer_res: 1
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 1,
                timestamp: 1531780252105,
                timeToLive: 0,
                partitionCounts: {
                    "hype-test-prefetch": 7,
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    testlayer_res: 1
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 2,
                timestamp: 1532455489889,
                timeToLive: 0,
                partitionCounts: {
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 3,
                timestamp: 1543022077792,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 4,
                timestamp: 1543023202816,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 5,
                timestamp: 1543031837309,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 6,
                timestamp: 1543032100211,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 7,
                timestamp: 1543032899619,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 8,
                timestamp: 1543261519800,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 9,
                timestamp: 1543271519176,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 2,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 10,
                timestamp: 1543363009076,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 11,
                timestamp: 1543364786130,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            },
            {
                version: 12,
                timestamp: 1544032618375,
                timeToLive: 0,
                partitionCounts: {
                    multilevel_testlayer: 33,
                    testlayer: 4,
                    "hype-test-prefetch": 7,
                    testlayer_res: 1,
                    "hype-test-prefetch-2": 7
                },
                dependencies: [
                    {
                        version: 0,
                        hrn: "hrn:here-dev:data:::here-internal-test",
                        direct: false
                    }
                ]
            }
        ]
    }
);

urlToResponses.set(
    "https://metadata.data.api.platform.in.here.com/metadata/v1/catalogs/here-internal-test/layerVersions?version=-1",
    {
        version: 12,
        layerVersions: [
            {
                layer: "hype-test-prefetch",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "testlayer_res",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "testlayer",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "multilevel_testlayer",
                version: 12,
                timestamp: 1544032618375
            },
            {
                layer: "hype-test-prefetch-2",
                version: 12,
                timestamp: 1544032618375
            }
        ]
    }
);

urlToResponses.set(
    "https://config.data.api.platform.in.here.com/config/v1/catalogs/hrn:here-dev:data:::here-internal-test",
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
                    hrn: "hrn:here:schema:::dummy_schema:1.0.0"
                }
            },
            {
                id: "testlayer",
                hrn: "hrn:here-dev:data:::here-internal-test:testlayer",
                name: "Test Layer",
                summary: "A test layer",
                description: "A simple test layer",
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
                layerType: "versioned"
            },
            {
                id: "multilevel_testlayer",
                hrn:
                    "hrn:here-dev:data:::here-internal-test:multilevel_testlayer",
                name: "Multi Level Test Layer",
                summary: "Multi Level Test Layer",
                description: "A multi level test layer just for testing",
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
                layerType: "versioned"
            },
            {
                id: "hype-test-prefetch-2",
                hrn:
                    "hrn:here-dev:data:::here-internal-test:hype-test-prefetch-2",
                name: "Hype Test Prefetch2",
                summary: "Layer for testing hype2 prefetching",
                description: "Layer for testing hype2 prefetching",
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
                tags: ["TEST"],
                billingTags: [],
                created: "2018-07-24T17:52:23.818Z",
                layerType: "versioned"
            }
        ],
        marketplaceReady: false,
        version: 3
    }
);

urlToResponses.set(
    "https://metadata.data.api.platform.in.here.com/metadata/v1/catalogs/here-internal-test/layers/testlayer/partitions?version=-1",
    {
        partitions: [
            {
                version: 12,
                partition: "269",
                layer: "testlayer",
                dataHandle: "ddb5a905-b5cb-406a-b048-1d10acb2a826"
            },
            {
                version: 12,
                partition: "270",
                layer: "testlayer",
                dataHandle: "8fd3d6a9-52ce-4465-a256-17d674b93e8a"
            },
            {
                version: 12,
                partition: "3",
                layer: "testlayer",
                dataHandle: "data:SomethingBaH!"
            }
        ]
    }
);

// NewCatalogClientOffline #getPartitionIndex
urlToResponses.set(
    "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::rib-2/layers/testlayer/partitions?version=-1",
    {
        partitions: [
            {
                version: 12,
                partition: "269",
                layer: "testlayer",
                dataHandle: "ddb5a905-b5cb-406a-b048-1d10acb2a826"
            },
            {
                version: 12,
                partition: "270",
                layer: "testlayer",
                dataHandle: "8fd3d6a9-52ce-4465-a256-17d674b93e8a"
            },
            {
                version: 12,
                partition: "3",
                layer: "testlayer",
                dataHandle: "data:SomethingBaH!"
            }
        ]
    }
);

urlToResponses.set(
    "https://metadata.data.api.platform.in.here.com/metadata/v1/catalogs/here-internal-test/layers/hype-test-prefetch/partitions?version=-1",
    {
        partitions: [
            {
                version: 12,
                partition: "1476147",
                layer: "hype-test-prefetch",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            },
            {
                version: 12,
                partition: "23618359",
                layer: "hype-test-prefetch",
                dataHandle: "c9116bb9-7d00-44bf-9b26-b4ab4c274665"
            },
            {
                version: 12,
                partition: "23618364",
                layer: "hype-test-prefetch",
                dataHandle: "541a3304-3bfe-4625-9898-29ea4869b052"
            },
            {
                version: 12,
                partition: "23618365",
                layer: "hype-test-prefetch",
                dataHandle: "448495fc-5359-467a-8a12-4179c0c56b25"
            },
            {
                version: 12,
                partition: "23618366",
                layer: "hype-test-prefetch",
                dataHandle: "e91a7396-c23b-46f5-9d70-6534c41c71f1"
            },
            {
                version: 12,
                partition: "23618367",
                layer: "hype-test-prefetch",
                dataHandle: "b49c283d-e234-469b-aa87-2e11edb17ce4"
            },
            {
                version: 12,
                partition: "5904591",
                layer: "hype-test-prefetch",
                dataHandle: "edac817d-1e62-464b-9e0f-79ea3694933d"
            }
        ]
    }
);

// NewCatalogClientOffline catalogs - getpartitions
urlToResponses.set(
    "https://xab.metadata.data.api.platform.here.com/metadata/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/partitions?version=-1",
    {
        partitions: [
            {
                version: 12,
                partition: "1476147",
                layer: "hype-test-prefetch",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            },
            {
                version: 12,
                partition: "23618359",
                layer: "hype-test-prefetch",
                dataHandle: "c9116bb9-7d00-44bf-9b26-b4ab4c274665"
            },
            {
                version: 12,
                partition: "23618364",
                layer: "hype-test-prefetch",
                dataHandle: "541a3304-3bfe-4625-9898-29ea4869b052"
            },
            {
                version: 12,
                partition: "23618365",
                layer: "hype-test-prefetch",
                dataHandle: "448495fc-5359-467a-8a12-4179c0c56b25"
            },
            {
                version: 12,
                partition: "23618366",
                layer: "hype-test-prefetch",
                dataHandle: "e91a7396-c23b-46f5-9d70-6534c41c71f1"
            },
            {
                version: 12,
                partition: "23618367",
                layer: "hype-test-prefetch",
                dataHandle: "b49c283d-e234-469b-aa87-2e11edb17ce4"
            },
            {
                version: 12,
                partition: "5904591",
                layer: "hype-test-prefetch",
                dataHandle: "edac817d-1e62-464b-9e0f-79ea3694933d"
            }
        ]
    }
);

urlToResponses.set(
    "https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/testlayer/data/94e6a1c0-8377-4298-8438-66a2c0bdeb27",
    createMockDownloadResponse("DT_1_1010")
);

urlToResponses.set(
    "https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/hype-test-prefetch/data/448495fc-5359-467a-8a12-4179c0c56b25",
    createMockDownloadResponse("DT_1_1010")
);

// NewCatalogClientOffline - blob getPartitions
urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/data/448495fc-5359-467a-8a12-4179c0c56b25",
    createMockDownloadResponse("DT_1_1010")
);

urlToResponses.set(
    "https://query.data.api.platform.in.here.com/query/v1/catalogs/here-internal-test/layers/hype-test-prefetch/versions/12/quadkeys/1/depths/4",
    createMockDownloadResponse({
        subQuads: [],
        parentQuads: []
    })
);

// NewCatalogClientOffline #getMissingTitle
urlToResponses.set(
    "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/versions/12/quadkeys/1/depths/4",
    createMockDownloadResponse({
        subQuads: [],
        parentQuads: []
    })
);

urlToResponses.set(
    "https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/hype-test-prefetch/data/KRAt-LQ9c-w24d-O60T",
    createMockDownloadResponse("DT_1_1010")
);
urlToResponses.set(
    "https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/hype-test-prefetch/data/pxFY-PlnK-DRBS-Is7F",
    createMockDownloadResponse("DT_1_1010")
);

urlToResponses.set(
    "https://query.data.api.platform.in.here.com/query/v1/catalogs/here-internal-test/layers/hype-test-prefetch/versions/3/quadkeys/1280/depths/4",
    {
        partitions: [
            {
                version: 2,
                partition: "268",
                layer: "testlayer",
                dataHandle: "94e6a1c0-8377-4298-8438-66a2c0bdeb27"
            },
            {
                version: 2,
                partition: "269",
                layer: "testlayer",
                dataHandle: "99b0f8fc-e71c-4fbc-b45f-eff363271da2"
            }
        ]
    }
);

// #getIndex
urlToResponses.set(
    "https://query.data.api.platform.in.here.com/query/v1/catalogs/here-internal-test/layers/hype-test-prefetch/versions/12/quadkeys/23618359/depths/4",
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
                partition: "1476147",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            }
        ]
    }
);

// NewCatalogClientOffline #getIndex
urlToResponses.set(
    "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/versions/12/quadkeys/23618359/depths/4",
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
                partition: "1476147",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            }
        ]
    }
);

// #getTile
urlToResponses.set(
    "https://query.data.api.platform.in.here.com/query/v1/catalogs/here-internal-test/layers/hype-test-prefetch/versions/12/quadkeys/92259/depths/4",
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

// NewCatalogClientOffline #getTile
urlToResponses.set(
    "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/versions/12/quadkeys/92259/depths/4",
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

/*
urlToResponses.set("https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/hype-test-prefetch/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665",
    createMockDownloadResponse("DT_1_1000")
);
*/
const headersMock = new Headers();
headersMock.append("etag", "1237696a7c876b7e");
urlToResponses.set(
    "https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/hype-test-prefetch/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665",
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

// NewCatalogClientOffline - blob
urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665",
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

//getTitles v2
urlToResponses.set(
    "https://query.data.api.platform.in.here.com/query/v1/catalogs/here-internal-test/layers/hype-test-prefetch/versions/12/quadkeys/5766/depths/4",
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

//getTitles v2
urlToResponses.set(
    "https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/hype-test-prefetch/data/da51785a-54b0-40cd-95ac-760f56fe5457",
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

// NewCatalogClientOffline #getTitles
urlToResponses.set(
    "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/versions/12/quadkeys/5766/depths/4",
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
// NewCatalogClientOffline #getTitles
urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/data/da51785a-54b0-40cd-95ac-760f56fe5457",
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
    "https://query.data.api.platform.in.here.com/query/v1/catalogs/here-internal-test/layers/hype-test-prefetch/versions/12/quadkeys/23064/depths/4",
    {
        subQuads: [
            {
                version: 12,
                subQuadKey: "115",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            },
            {
                version: 12,
                subQuadKey: "463",
                dataHandle: "edac817d-1e62-464b-9e0f-79ea3694933d"
            }
        ],
        parentQuads: []
    }
);

urlToResponses.set(
    "https://blobstore.data.api.platform.in.here.com/blobstore/v1/catalogs/here-internal-test/layers/hype-test-prefetch/data/edac817d-1e62-464b-9e0f-79ea3694933d",
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

// NewCatalogClientOffline #getAgregatedTitle
urlToResponses.set(
    "https://xab.query.data.api.platform.here.com/query/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/versions/12/quadkeys/23064/depths/4",
    {
        subQuads: [
            {
                version: 12,
                subQuadKey: "115",
                dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
            },
            {
                version: 12,
                subQuadKey: "463",
                dataHandle: "edac817d-1e62-464b-9e0f-79ea3694933d"
            }
        ],
        parentQuads: []
    }
);

// NewCatalogClientOffline #getAgregatedTitle
urlToResponses.set(
    "https://blob.data.api.platform.here.com/blobstore/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/data/edac817d-1e62-464b-9e0f-79ea3694933d",
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

// #getDataCoverageBitmap
urlToResponses.set(
    "https://statistics.data.api.platform.in.here.com/statistics/v1/catalogs/hrn:here-dev:data:::here-internal-test/layers/hype-test-prefetch/tilemap?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        blob: sinon.stub().returns("heatmap-tillemap-blob")
    }
);

// NewCatalogClientOffline #getDataCoverageBitmap
urlToResponses.set(
    "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/tilemap?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        blob: sinon.stub().returns("heatmap-tillemap-blob")
    }
);

urlToResponses.set(
    "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/partitions?version=12",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        json: sinon.stub().returns({
            partitions: [
                {
                    version: 12,
                    partition: "23618365",
                    layer: "hype-test-prefetch",
                    dataHandle: "448495fc-5359-467a-8a12-4179c0c56b25"
                }
            ]
        }),
        arrayBuffer: sinon.stub(),
        blob: sinon.stub()
    }
);

urlToResponses.set(
    "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::rib-2/layers/testlayer/partitions?version=12",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        json: sinon.stub().returns({
            partitions: [
                {
                    version: 12,
                    partition: "23618365",
                    layer: "hype-test-prefetch",
                    dataHandle: "448495fc-5359-467a-8a12-4179c0c56b25"
                }
            ]
        }),
        arrayBuffer: sinon.stub(),
        blob: sinon.stub()
    }
);

// #getDataCoverageSizeMap
urlToResponses.set(
    "https://statistics.data.api.platform.in.here.com/statistics/v1/catalogs/hrn:here-dev:data:::here-internal-test/layers/hype-test-prefetch/heatmap/size?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        blob: sinon.stub().returns("heatmap-size-blob")
    }
);

// NewCatalogClientOffline #getDataCoverageSizeMap
urlToResponses.set(
    "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/heatmap/size?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        blob: sinon.stub().returns("heatmap-size-blob")
    }
);

// #getDataCoverageTimeMap
urlToResponses.set(
    "https://statistics.data.api.platform.in.here.com/statistics/v1/catalogs/hrn:here-dev:data:::here-internal-test/layers/hype-test-prefetch/heatmap/age?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        blob: sinon.stub().returns("heatmap-age-blob")
    }
);

// NewCatalogClientOffline #getDataCoverageTimeMap
urlToResponses.set(
    "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/heatmap/age?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        blob: sinon.stub().returns("heatmap-age-blob")
    }
);

// #getSummary
urlToResponses.set(
    "https://statistics.data.api.platform.in.here.com/statistics/v1/catalogs/hrn:here-dev:data:::here-internal-test/layers/hype-test-prefetch/summary?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        json: sinon.stub().returns("summary"),
        text: sinon.stub().returns("summary")
    }
);

// NewCatalogClientOffline #getSummary
urlToResponses.set(
    "https://statistics.data.api.platform.here.com/statistics/v1/catalogs/hrn:here:data:::rib-2/layers/hype-test-prefetch/summary?version=-1",
    {
        type: "aaa",
        status: 200,
        statusText: "success",
        ok: true,
        headers: headersMock,
        arrayBuffer: sinon.stub(),
        json: sinon.stub().returns("summary"),
        text: sinon.stub().returns("summary")
    }
);

// #getSchema
const DUMMY_SCHEMA_SIZE = 10;
urlToResponses.set(
    // tslint:disable-next-line:max-line-length
    "https://artifact.api.platform.in.here.com/v1/schema/hrn:here:schema:::dummy_schema:1.0.0",
    {
        schema: {
            hrn: "hrn:here:schema:::dummy_schema:1.0.0",
            groupId: "",
            artifactId: "dummy",
            name: "",
            summary: "",
            version: "1.0.0",
            created: "2018-10-16T05:52:18.707Z",
            updated: "2018-10-25T05:44:57.904Z"
        },
        artifacts: [
            {
                hrn: "hrn:here:artifact:::dummy_schema_proto:1.0.0",
                groupId: "",
                artifactId: "dummy_proto",
                version: "1.0.0",
                created: "2018-10-16T05:52:27.881Z",
                updated: "2018-10-16T05:52:27.881Z"
            }
        ],
        variants: [
            {
                id: "ds",
                url:
                    "/artifact/hrn:here:artifact:::dummy_schema_ds:1.0.0/dummy_ds-1.0.0.zip"
            }
        ]
    }
);

urlToResponses.set(
    // tslint:disable-next-line:max-line-length
    "https://artifact.api.platform.in.here.com/v1/artifact/hrn:here:artifact:::dummy_schema_ds:1.0.0/dummy_ds-1.0.0.zip",
    {
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(DUMMY_SCHEMA_SIZE)),
        ok: true,
        status: 200
    }
);

// NewCatalogClientOffline #getSchema - by dummy_schema:1.0.3

urlToResponses.set(
    // tslint:disable-next-line:max-line-length
    "https://artifact.api.platform.here.com/v1/schema/hrn:here:schema:::dummy_schema:1.0.3",
    {
        schema: {
            hrn: "hrn:here:schema:::dummy_schema:1.0.3",
            groupId: "",
            artifactId: "dummy",
            name: "",
            summary: "",
            version: "1.0.3",
            created: "2018-10-16T05:52:18.707Z",
            updated: "2018-10-25T05:44:57.904Z"
        },
        artifacts: [
            {
                hrn: "hrn:here:artifact:::dummy_schema_proto:1.0.3",
                groupId: "",
                artifactId: "dummy_proto",
                version: "1.0.3",
                created: "2018-10-16T05:52:27.881Z",
                updated: "2018-10-16T05:52:27.881Z"
            }
        ],
        variants: [
            {
                id: "ds",
                url:
                    "/artifact/hrn:here:artifact:::dummy_schema_ds:1.0.3/dummy_ds-1.0.3.zip"
            }
        ]
    }
);

urlToResponses.set(
    // tslint:disable-next-line:max-line-length
    "https://artifact.api.platform.here.com/v1/artifact/hrn:here:artifact:::dummy_schema_ds:1.0.3/dummy_ds-1.0.3.zip",
    {
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(DUMMY_SCHEMA_SIZE)),
        ok: true,
        status: 200
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

// CatalogClient

describe("CatalogClientOffline", () => {
    let catalogClient: CatalogClient;

    before(async () => {
        const testHRN = HRN.fromString("hrn:here:data:::rib-2");
        const newPromise = () => Promise.resolve("7534286159");
        const context = new DataStoreContext({
            dm: createMockDownloadManager(),
            environment: "here",
            getToken: newPromise
        });

        catalogClient = new CatalogClient({
            context,
            hrn: testHRN.toString()
        });
        assert.isNotNull(catalogClient);
    });

    it("#getLatestVersion", async () => {
        const versionResponse = await catalogClient.getLatestVersion();
        assert.isDefined(versionResponse);
        assert.isTrue(versionResponse.version > 0);
    });

    it("#getVersions", async () => {
        const versions1 = await catalogClient.getVersions();
        assert.isDefined(versions1);
        assert.isTrue(versions1.versions.length > 0, "versions list is empty");

        const versions2 = await catalogClient.getVersions(-1, undefined);
        assert.isDefined(versions2);
        assert.isTrue(versions2.versions.length > 0, "versions list is empty");
    });

    it("#getLayer", async () => {
        const layer = (await catalogClient.getVolatileOrVersionedLayer(
            "testlayer_res"
        )) as CatalogLayer;
        assert.isDefined(layer);
    });

    it("#getLayerNonExisting", () => {
        catalogClient
            .getVolatileOrVersionedLayer("NonExistingLayer")
            .catch(err => {
                assert.isDefined(err);
            });
    });
});
