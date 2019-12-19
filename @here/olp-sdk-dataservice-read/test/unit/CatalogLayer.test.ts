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

import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import * as dataServiceRead from "../../lib";
import { BlobApi, MetadataApi, QueryApi, ConfigApi, VolatileBlobApi, CoverageApi, ArtifactApi } from "@here/olp-sdk-dataservice-api";
import { Index } from "@here/olp-sdk-dataservice-api/lib/query-api";
import { getVolatileBlob } from "@here/olp-sdk-dataservice-api/lib/volatile-blob-api";
import { CatalogLayer } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

class MockedConfigCacheRepository {
    constructor(private readonly cache: Map<string, string>) {
    }

    public get(
        hrn: string,
        layerId: string,
        version: number
    ) {
        const result = this.cache.get(`сatalog::${hrn}::${layerId}::${version}`);
        return result ? JSON.parse(result) : result;
    }

    public put(
        hrn: string,
        layerId: string,
        version: number,
        catalog: ConfigApi.Catalog
    ): boolean {
        this.cache.set(`сatalog::${hrn}::${layerId}::${version}`, JSON.stringify(catalog));
        return true;
    }
}

class MockedOlpClientSettings {
    private keyValueCache = new dataServiceRead.KeyValueCache();

    constructor() {}
    get cache() {
        return this.keyValueCache;
    }
    get environment() {
        return "test-env";
    }
    get token() {
        return Promise.resolve("mocked-token");
    }
    get downloadManager() {
        return {
            download: (url: string) => Promise.resolve("mocked-results")
        };
    }
}

describe("CatalogLayerClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getBlobStub: sinon.SinonStub;
    let getVolatileBlobStub: sinon.SinonStub;
    let getPartitionsByIdStub: sinon.SinonStub;
    let getVersionStub: sinon.SinonStub;
    let getCatalogStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let ConfigCacheRepositoryStub: sinon.SinonStub;
    let getDataCoverageSummaryStub: sinon.SinonStub;
    let getStatisticsBitMapStub: sinon.SinonStub;
    let getStatisticsSizeMapStub: sinon.SinonStub;
    let getStatisticsTimeMapStub: sinon.SinonStub;
    let getArtifactUsingGETStub: sinon.SinonStub;
    let getSchemaUsingGETStub: sinon.SinonStub;
    let layerDataProvider: dataServiceRead.LayerDataProvider;
    let statisticsClient: dataServiceRead.StatisticsClient;
    let artifactClient: dataServiceRead.ArtifactClient;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn"
    );
    const mockedHRNVolatile = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn-volatile"
    );
    const mockedHRNIndex = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn-index"
    );
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = new MockedOlpClientSettings();

        layerDataProvider = new dataServiceRead.LayerDataProvider(
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );

        statisticsClient = new dataServiceRead.StatisticsClient(
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
        artifactClient = new dataServiceRead.ArtifactClient(
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
    });

    beforeEach(() => {
        getBlobStub = sandbox.stub(BlobApi, "getBlob");
        getVolatileBlobStub = sandbox.stub(VolatileBlobApi, "getVolatileBlob");
        getPartitionsByIdStub = sandbox.stub(QueryApi, "getPartitionsById");
        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
        getCatalogStub = sandbox.stub(ConfigApi, "getCatalog");
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getDataCoverageSummaryStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageSummary"
        );
        getStatisticsBitMapStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageTile"
        );
        getStatisticsSizeMapStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageSizeMap"
        );
        getStatisticsTimeMapStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageTimeMap"
        );
        getArtifactUsingGETStub = sandbox.stub(
            ArtifactApi,
            "getArtifactUsingGET"
        );
        getSchemaUsingGETStub = sandbox.stub(
            ArtifactApi,
            "getSchemaUsingGET"
        );
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));

        ConfigCacheRepositoryStub = sandbox.stub(
            dataServiceRead,
            "ConfigCacheRepository"
        );
        ConfigCacheRepositoryStub.callsFake(
            (cache) => new MockedConfigCacheRepository(cache)
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised", async () => {
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);

        assert.isDefined(layerDataProvider);
        expect(layerClient).be.instanceOf(dataServiceRead.CatalogLayer);
    });

    it("Should method getData provide data with dataHandle parameter for versioned layer", async () => {
        const mockedBlobData: Response = new Response("mocked-blob-response");
        const dataHandle = new dataServiceRead.DataRequest().withDataHandle(
            "3C3BE24A341D82321A9BA9075A7EF498.123"
        );
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };

        getBlobStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const response = await layerClient.getData(
            (dataHandle as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData provide data with dataHandle parameter for volatile layer", async () => {
        const mockedBlobData: Response = new Response("mocked-blob-response");
        const mockedVersion = { version: 42 };
        const dataHandle = new dataServiceRead.DataRequest().withDataHandle("3C3BE24A341D82321A9BA9075A7EF498.123");
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "volatile"
                }
            ],
            version: 3
        };

        getVolatileBlobStub.callsFake(
            (
                builder: any, 
                params: any
            ): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRNVolatile, mockedLayerId);
        const response = await layerClient.getData(
            (dataHandle as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData return error for index layer", async () => {
        const dataHandle = new dataServiceRead.DataRequest().withDataHandle("3C3BE24A341D82321A9BA9075A7EF498.123");
        const mockedErrorResponse = `Error. Only Versioned amd Volatile layers are supported.`;
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "index"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRNIndex, mockedLayerId, 42);
        const response = await layerClient.getData(
            (dataHandle as unknown) as dataServiceRead.DataRequest
        ).catch(error => {
            assert.isDefined(error);
            assert.equal(mockedErrorResponse, error.message);
        });
    });

    it("Should method getModel return layer model", async () => {
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "volatile"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRNVolatile, mockedLayerId, 42);
        const model = await layerClient.getModel();
        assert.isDefined(model);
        expect(model.id).to.be.equal("mocked-layed-id");
    });

    it("Should method getPartitions provide data with partitionIds parameter for versioned layer", async () => {
        const mockedIds = ["1", "2", "13", "42"];
        const mockedBlobData: Response = new Response("mocked-blob-response");
        const mockedVersion = {
            version: 42
        };
        const request = new dataServiceRead.PartitionsRequest()
            .withPartitionIds(mockedIds)
            .withVersion(42);
        const mockedPartitions = {
            partitions: [
                {
                    version: 1,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                },
                {
                    version: 42,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };

        getPartitionsByIdStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<QueryApi.Partitions> => {
                return Promise.resolve(mockedPartitions);
            }
        );

        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        getBlobStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const partitions = await layerClient.getPartitions(
            (request as unknown) as dataServiceRead.PartitionsRequest
        );
        assert.isDefined(partitions);
        expect(partitions).to.be.equal(mockedPartitions);
    });

    it("Should method getPartitions provide data with partitionIds parameter for volatile layer", async () => {
        const mockedIds = ["1", "2", "13", "42"];
        const mockedBlobData: Response = new Response("mocked-blob-response");
        const mockedVersion = {
            version: 42
        };
        const request = new dataServiceRead.PartitionsRequest()
            .withPartitionIds(mockedIds)
            .withVersion(42);
        const mockedPartitions = {
            partitions: [
                {
                    version: 1,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                },
                {
                    version: 42,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };

        getPartitionsByIdStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<QueryApi.Partitions> => {
                return Promise.resolve(mockedPartitions);
            }
        );

        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        getVolatileBlobStub.callsFake(
            (
                builder: any, 
                params: any
            ): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRNVolatile, mockedLayerId);
        const partitions = await layerClient.getPartitions(
            (request as unknown) as dataServiceRead.PartitionsRequest
        );
        assert.isDefined(partitions);
        expect(partitions).to.be.equal(mockedPartitions);
    });

    it("Should method getPartitions return error for index layer", async () => {
        const request = new dataServiceRead.PartitionsRequest();
        const mockedErrorResponse = `Error. Only Versioned amd Volatile layers are supported.`;
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "index"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const layerClient = await layerDataProvider.connect(mockedHRNIndex, mockedLayerId, 42);
        const response = await layerClient.getPartitions(
            (request as unknown) as dataServiceRead.PartitionsRequest
        ).catch(error => {
            assert.isDefined(error);
            assert.equal(mockedErrorResponse, error.message);
        });
    });

    it("Should method getSummary provide data", async () => {
        const mockedSummary: CoverageApi.LayerSummary = {
            catalogHRN: "hrn:here:data:::mocked-hrn",
            layer: mockedLayerId,
            levelSummary: {
                "1": {
                    size: 12121122,
                    processedTimestamp: 12312132135,
                    maxPartitionSize: 42,
                    centroid: 4201,
                    totalPartitions: 2000,
                    version: 42,
                    minPartitionSize: 1,
                    boundingBox: {
                        east: 1,
                        north: 2,
                        south: 3,
                        west: 4
                    }
                }
            }
        };
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };
        
        getDataCoverageSummaryStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<CoverageApi.LayerSummary> => {
                return Promise.resolve(mockedSummary);
            }
        );

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const summaryRequest = new dataServiceRead.SummaryRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId);
        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const summary = await layerClient.getSummary(summaryRequest);
        assert.isDefined(summary);
        expect(summary).to.be.equal(mockedSummary);
    });

    it("Should method getSummary return error for index layer", async () => {
        const mockedErrorResponse = `Error. This method is allowed only for versioned layers.`;
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "index"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );
        const summaryRequest = new dataServiceRead.SummaryRequest();
        const layerClient = await layerDataProvider.connect(mockedHRNIndex, mockedLayerId, 42);
        const summary = await layerClient.getSummary(summaryRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });

    });

    it("Should method getStatistics provide data", async () => {
        const mockedStatistics: Response = new Response("mocked-response");
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        getStatisticsBitMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsSizeMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsTimeMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        const statisticBitMapRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withDataLevel("12")
            .withTypemap(dataServiceRead.CoverageDataType.BITMAP);
        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const statistics = await layerClient.getStatistics(statisticBitMapRequest);
        assert.isDefined(statistics);
        expect(statistics).to.be.equal(mockedStatistics);
    });

    it("Should method getStatistics return error for index layer", async () => {
        const mockedErrorResponse = `Error. This method is allowed only for versioned layers.`;
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "mocked-layed-id",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "index"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );
        const statisticsRequest = new dataServiceRead.StatisticsRequest();
        const layerClient = await layerDataProvider.connect(mockedHRNIndex, mockedLayerId, 42);
        const statistics = await layerClient.getStatistics(statisticsRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });

    });

    it("Should method getSchema provide data", async () => {
        const mockedSchema: Response = new Response(null, {
            statusText: "mocked response"
        });
        const mockedVersion = {
            id: "42",
            url: "http://fake.url"
        };
        
        assert.isDefined(artifactClient);
        getArtifactUsingGETStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedSchema);
            }
        );

        const schemaRequest = new dataServiceRead.SchemaRequest().withVariant(
            mockedVersion
        );
        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const response = await layerClient.getSchema(schemaRequest);
        assert.isDefined(response);
    });

    it("Should method getSchema return error without variant data provided", async () => {
        const mockedError: string =
            "Please provide the schema variant by schemaRequest.withVariant()";
        
        assert.isDefined(artifactClient);

        const schemaRequest = new dataServiceRead.SchemaRequest();
        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const response = await layerClient
            .getSchema(schemaRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedError, error.message);
            });
    });

    it("Should method getSchemaDetails provide data", async () => {
        const mockedSchema: ArtifactApi.GetSchemaResponse = {
            variants: [
                {
                    id: "42",
                    url: "https://fake.url"
                }
            ]
        };
        
        assert.isDefined(artifactClient);
        getSchemaUsingGETStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ArtifactApi.GetSchemaResponse> => {
                return Promise.resolve(mockedSchema);
            }
        );

        const schemaDetailsRequest = new dataServiceRead.SchemaDetailsRequest().withSchema(
            mockedHRN
        );
        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const response = await layerClient.getSchemaDetails(schemaDetailsRequest);
        assert.isDefined(response);
        expect(mockedSchema).be.equal(response);
    });

    it("Should method getSchemaDetails return error without variant data provided", async () => {
        const mockedError: string =
            "Please provide the schema HRN by schemaDetailsRequest.withScema()";
        
        assert.isDefined(artifactClient);

        const schemaRequest = new dataServiceRead.SchemaDetailsRequest();
        const layerClient = await layerDataProvider.connect(mockedHRN, mockedLayerId, 42);
        const response = await layerClient
            .getSchemaDetails(schemaRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedError, error.message);
            });
    });
});
