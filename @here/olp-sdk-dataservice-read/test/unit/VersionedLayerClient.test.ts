/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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

import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import { BlobApi, MetadataApi, QueryApi } from "@here/olp-sdk-dataservice-api";
import { Index } from "@here/olp-sdk-dataservice-api/lib/query-api";
import * as core from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VersionedLayerClient", function() {
    let sandbox: sinon.SinonSandbox;
    let getBlobStub: sinon.SinonStub;
    let getPartitionsStub: sinon.SinonStub;
    let getPartitionsByIdStub: sinon.SinonStub;
    let getQuadTreeIndexStub: sinon.SinonStub;
    let getVersionStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let versionedLayerClient: dataServiceRead.VersionedLayerClient;
    const mockedHRN = core.HRN.fromString("hrn:here:data:::mocked-hrn");
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";
    const mockedPartitionsAddFields = {
        partitions: [
            {
                version: 1,
                partition: "42",
                dataHandle: "mocked-datahandle",
                dataSize: 123124,
                checksum: "100500",
                compressedDataSize: 42
            },
            {
                version: 42,
                partition: "13",
                dataHandle: "another-mocked-datahandle",
                dataSize: 100500,
                checksum: "123124"
            }
        ]
    };

    before(function() {
        sandbox = sinon.createSandbox();
        let settings = new core.OlpClientSettings({
            environment: "here",
            getToken: () => Promise.resolve("token")
        });

        const versionedLayerClientParams = {
            catalogHrn: mockedHRN,
            layerId: mockedLayerId,
            settings,
            version: 5
        };

        versionedLayerClient = new dataServiceRead.VersionedLayerClient(
            versionedLayerClientParams
        );

        const versionedLayerClientParamsWithoutVersion = {
            catalogHrn: mockedHRN,
            layerId: mockedLayerId,
            settings
        };
    });

    beforeEach(function() {
        getBlobStub = sandbox.stub(BlobApi, "getBlob");
        getPartitionsStub = sandbox.stub(MetadataApi, "getPartitions");
        getPartitionsByIdStub = sandbox.stub(QueryApi, "getPartitionsById");
        getQuadTreeIndexStub = sandbox.stub(QueryApi, "quadTreeIndex");
        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
        getBaseUrlRequestStub = sandbox.stub(core.RequestFactory, "getBaseUrl");

        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("Shoud be initialized", async function() {
        assert.isDefined(versionedLayerClient);
    });

    it("VersionedLayerClient instance should be initialized with VersionedLayerClientParams", async function() {
        assert.isDefined(versionedLayerClient);
        assert.equal(versionedLayerClient["version"], 5);
        assert.equal(versionedLayerClient["hrn"], "hrn:here:data:::mocked-hrn");
    });

    it("Should method getData provide data with dataHandle parameter", async function() {
        const mockedVersion = {
            version: 42
        };
        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        const mockedBlobData: Response = new Response("mocked-blob-response");
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        const dataRequest = new dataServiceRead.DataRequest().withDataHandle(
            "moсked-data-handle"
        );

        const response = await versionedLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData provide data with partitionId parameter", async function() {
        const mockedBlobData = new Response("mocked-blob-response");
        const mockedVersion = {
            version: 42
        };
        const mockedPartitionsIdData = {
            partitions: [
                {
                    version: 1,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                return Promise.resolve(mockedPartitionsIdData);
            }
        );
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
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

        const dataRequest = new dataServiceRead.DataRequest().withPartitionId(
            "42"
        );

        const response = await versionedLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData provide data with partitionId parameter and version", async function() {
        const mockedBlobData = new Response("mocked-blob-response");
        const mockedPartitionsIdData = {
            partitions: [
                {
                    version: 1,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                return Promise.resolve(mockedPartitionsIdData);
            }
        );
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        const dataRequest = new dataServiceRead.DataRequest().withPartitionId(
            "42"
        );

        const response = await versionedLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData return Error without dataRequest parameters", async function() {
        const mockedErrorResponse =
            "No data provided. Add dataHandle, partitionId or quadKey to the DataRequest object";
        const dataRequest = new dataServiceRead.DataRequest();

        const response = await versionedLayerClient
            .getData((dataRequest as unknown) as dataServiceRead.DataRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getData return Error with correct partitionId and wrong version parameter", async function() {
        const dataRequest = new dataServiceRead.DataRequest().withPartitionId(
            "42"
        );

        const mockedPartitionsIdData = {
            status: 400,
            title: "Bad request",
            detail: [
                {
                    name: "version",
                    error: "Invalid version: latest known version is 181"
                }
            ]
        };

        getPartitionsByIdStub.callsFake((builder: any, params: any): any => {
            return Promise.reject(mockedPartitionsIdData);
        });

        const response = await versionedLayerClient
            .getData((dataRequest as unknown) as dataServiceRead.DataRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(error, mockedPartitionsIdData);
            });
    });

    it("Should method getData with wrong partitionId parameter and version return error", async function() {
        const mockedBlobData = new Response("mocked-blob-response");
        const mockedErrorResponse =
            "No partition dataHandle for partition 42. HRN: hrn:here:data:::mocked-hrn";
        const mockedPartitionsIdData = {
            partitions: [
                {
                    version: 1,
                    partition: "13",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                return Promise.resolve(mockedPartitionsIdData);
            }
        );
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        const dataRequest = new dataServiceRead.DataRequest().withPartitionId(
            "42"
        );

        const response = await versionedLayerClient
            .getData((dataRequest as unknown) as dataServiceRead.DataRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should be aborted fetching by abort signal", async function() {
        const mockedBlobData = new Response("mocked-blob-response");
        const mockedPartitionsIdData = {
            partitions: [
                {
                    version: 1,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                return Promise.resolve(mockedPartitionsIdData);
            }
        );
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return builder.abortSignal.aborted
                    ? Promise.reject("AbortError")
                    : Promise.resolve(mockedBlobData);
            }
        );

        const dataRequest = new dataServiceRead.DataRequest().withPartitionId(
            "42"
        );

        const abortController = new AbortController();

        versionedLayerClient
            .getData(
                (dataRequest as unknown) as dataServiceRead.DataRequest,
                abortController.signal
            )
            .then()
            .catch((err: any) => {
                assert.strictEqual(err, "AbortError");
                assert.isTrue(abortController.signal.aborted);
            });

        abortController.abort();
    });

    it("Should method getPartitions provide data with PartitionsRequest", async function() {
        const mockedVersion = {
            version: 42
        };
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
        getPartitionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.Partitions> => {
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

        const partitionsRequest = new dataServiceRead.PartitionsRequest();
        const partitions = await versionedLayerClient.getPartitions(
            partitionsRequest
        );

        assert.isDefined(partitions);
        expect(partitions).to.be.equal(mockedPartitions);
    });

    it("Should method getPartitions provide data with PartitionIds list", async function() {
        const mockedIds = ["1", "2", "13", "42"];
        const mockedVersion = {
            version: 42
        };
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
        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
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

        const partitionsRequest = new dataServiceRead.PartitionsRequest().withPartitionIds(
            mockedIds
        );
        const partitions = await versionedLayerClient.getPartitions(
            partitionsRequest
        );

        assert.isDefined(partitions);
        expect(partitions).to.be.equal(mockedPartitions);
    });

    it("Should layerClient sends a PartitionsRequest for getPartitions with additionalFields params", async function() {
        const mockedVersion = {
            version: 42
        };

        getPartitionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.Partitions> => {
                return Promise.resolve(mockedPartitionsAddFields);
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

        const partitionsRequest = new dataServiceRead.PartitionsRequest().withAdditionalFields(
            ["dataSize", "checksum"]
        );
        const partitionsResponse = await versionedLayerClient.getPartitions(
            partitionsRequest
        );

        assert.isDefined(partitionsResponse);
        expect(partitionsResponse).to.be.equal(mockedPartitionsAddFields);
        expect(partitionsResponse.partitions[0]).to.be.equal(
            mockedPartitionsAddFields.partitions[0]
        );
        expect(partitionsResponse.partitions[1]).to.be.equal(
            mockedPartitionsAddFields.partitions[1]
        );

        assert.isDefined(getPartitionsStub.getCalls()[0].args);
        expect(
            getPartitionsStub.getCalls()[0].args[1].additionalFields[0]
        ).to.be.equal("dataSize");
        expect(
            getPartitionsStub.getCalls()[0].args[1].additionalFields[1]
        ).to.be.equal("checksum");
    });

    it("Should layerClient sends a PartitionsRequest for getPartitions with additionalFields params and get cached data", async function() {
        const partitionsRequest = new dataServiceRead.PartitionsRequest().withAdditionalFields(
            ["dataSize", "checksum"]
        );
        const partitionsResponse = await versionedLayerClient.getPartitions(
            partitionsRequest
        );

        assert.isDefined(partitionsResponse);
        expect(partitionsResponse.partitions[0].dataHandle).to.be.equal(
            mockedPartitionsAddFields.partitions[0].dataHandle
        );
        expect(partitionsResponse.partitions[1].dataHandle).to.be.equal(
            mockedPartitionsAddFields.partitions[1].dataHandle
        );
    });

    it("Should layerClient sends a PartitionsRequest for getPartitions with extra additionalFields params, check cached data and get new metadata", async function() {
        const mockedVersion = {
            version: 42
        };

        getPartitionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.Partitions> => {
                return Promise.resolve(mockedPartitionsAddFields);
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

        const partitionsRequest = new dataServiceRead.PartitionsRequest().withAdditionalFields(
            ["dataSize", "checksum", "compressedDataSize"]
        );
        const partitionsResponse = await versionedLayerClient.getPartitions(
            partitionsRequest
        );

        assert.isDefined(partitionsResponse);
        expect(partitionsResponse.partitions[0].dataHandle).to.be.equal(
            mockedPartitionsAddFields.partitions[0].dataHandle
        );
        expect(partitionsResponse.partitions[1].dataHandle).to.be.equal(
            mockedPartitionsAddFields.partitions[1].dataHandle
        );
    });

    it("Should method getPartitions return error without QuadKeyPartitionsRequest", async function() {
        const mockedErrorResponse = {
            message: "Please provide correct QuadKey"
        };

        const quadKeyRequest = new dataServiceRead.QuadKeyPartitionsRequest();
        const partitions = await versionedLayerClient
            .getPartitions(quadKeyRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse.message, error.message);
            });
    });

    it("Should layerClient sends a QuadKeyPartitionsRequest for getPartitions with additionalFields params", async function() {
        const mockedBlobData = new Response("mocked-blob-response");
        const mockedVersion = {
            version: 42
        };
        const mockedQuadKeyTreeData = {
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
                    partition: "23618403",
                    dataHandle: "da51785a-54b0-40cd-95ac-760f56fe5457"
                }
            ]
        };

        getQuadTreeIndexStub.callsFake(
            (builder: any, params: any): Promise<Index> => {
                return Promise.resolve(mockedQuadKeyTreeData);
            }
        );
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
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

        const quadKeyPartitionsRequest = new dataServiceRead.QuadKeyPartitionsRequest()
            .withQuadKey(core.TileKey.fromMortonCode(23618403))
            .withAdditionalFields([
                "dataSize",
                "checksum",
                "compressedDataSize"
            ]);

        const partitionsResponse = await versionedLayerClient.getPartitions(
            quadKeyPartitionsRequest
        );
        assert.isDefined(partitionsResponse);

        // check if layer client sends a request for getPartitions with correct params
        expect(
            getQuadTreeIndexStub.getCalls()[0].args[1].additionalFields[0]
        ).to.be.equal("dataSize");
        expect(
            getQuadTreeIndexStub.getCalls()[0].args[1].additionalFields[1]
        ).to.be.equal("checksum");
        expect(
            getQuadTreeIndexStub.getCalls()[0].args[1].additionalFields[2]
        ).to.be.equal("compressedDataSize");
    });

    it("Should baseUrl error be handled", async function() {
        const mockedErrorResponse = "Bad response";
        const dataHandleRequest = new dataServiceRead.DataRequest().withDataHandle(
            "moсked-data-handle"
        );
        const dataPartitionRequest = new dataServiceRead.DataRequest().withPartitionId(
            "mocked-id"
        );
        const partitionsRequest = new dataServiceRead.PartitionsRequest();

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                return Promise.reject("base url not found");
            }
        );

        getBaseUrlRequestStub.callsFake(() =>
            Promise.reject({
                status: 400,
                statusText: "Bad response"
            })
        );

        const dataH = await versionedLayerClient
            .getData(dataHandleRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.statusText);
            });

        const dataP = await versionedLayerClient
            .getData(dataPartitionRequest)
            .catch(error => {
                assert.isDefined(error);
            });

        const partitions = await versionedLayerClient
            .getPartitions(partitionsRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.statusText);
            });
    });

    it("Should latestVersion error be handled", async function() {
        const mockedErrorResponse = "Bad response";
        const dataPartitionRequest = new dataServiceRead.DataRequest().withPartitionId(
            "mocked-id"
        );
        const partitionsRequest = new dataServiceRead.PartitionsRequest();

        getVersionStub.callsFake(() =>
            Promise.reject({
                status: 400,
                statusText: "Bad response"
            })
        );

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                return Promise.reject("base url not found");
            }
        );

        getBaseUrlRequestStub.callsFake(() =>
            Promise.reject({
                status: 400,
                statusText: "Bad response"
            })
        );

        const dataP = await versionedLayerClient
            .getData(dataPartitionRequest)
            .catch(error => {
                assert.isDefined(error);
            });

        const partitions = await versionedLayerClient
            .getPartitions(partitionsRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.statusText);
            });

        const partitions1 = await versionedLayerClient
            .getPartitions(partitionsRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.statusText);
            });
    });

    it("Should getPartitions error be handled if error getting latest layer version", async function() {
        getVersionStub.callsFake(() =>
            Promise.reject({
                status: 400,
                statusText: "Bad response"
            })
        );

        const layer = new dataServiceRead.VersionedLayerClient({
            catalogHrn: mockedHRN,
            layerId: "",
            settings: {} as any
        });

        try {
            await layer.getPartitions({
                getBillingTag: () => undefined,
                getVersion: () => undefined
            } as any);
        } catch (error) {
            if (error.status !== 400) {
                assert.fail(error.status, 400);
            }

            if (error.statusText !== "Bad response") {
                assert.fail(error.statusText, "Bad response");
            }
        }
    });

    it("Should getData error be handled if error getting latest layer version", async function() {
        getVersionStub.callsFake(() =>
            Promise.reject({
                status: 400,
                statusText: "Bad response"
            })
        );

        const layer = new dataServiceRead.VersionedLayerClient({
            catalogHrn: mockedHRN,
            layerId: "",
            settings: {} as any
        });

        try {
            await layer.getData({
                getBillingTag: () => undefined,
                getDataHandle: () => undefined,
                getPartitionId: () => undefined,
                getVersion: () => undefined,
                getQuadKey: () => undefined
            } as any);
        } catch (error) {
            if (error.status !== 400) {
                assert.fail(error.status, 400);
            }

            if (error.statusText !== "Bad response") {
                assert.fail(error.statusText, "Bad response");
            }
        }
    });

    it("Should getPartitions fetch menadata with latest layer version if not defined", async function() {
        getVersionStub.callsFake(() => Promise.resolve({ version: 5 }));

        getPartitionsStub.callsFake((builder, params) => {
            assert.equal(params.version, 5);
            return Promise.resolve();
        });

        const layer = new dataServiceRead.VersionedLayerClient({
            catalogHrn: mockedHRN,
            layerId: "",
            settings: {} as any
        });

        await layer.getPartitions({
            getBillingTag: () => undefined,
            getPartitionIds: () => undefined,
            getAdditionalFields: () => undefined,
            getVersion: () => undefined,
            getFetchOption: () => core.FetchOptions.OnlineOnly
        } as any);
    });

    it("Should getPartitions fetch menadata with set layer version in constructor", async function() {
        getPartitionsStub.callsFake((builder, params) => {
            assert.equal(params.version, 6);
            return Promise.resolve();
        });

        const layer = new dataServiceRead.VersionedLayerClient({
            catalogHrn: mockedHRN,
            layerId: mockedLayerId,
            settings: {} as any,
            version: 6
        });

        await layer.getPartitions({
            getBillingTag: () => undefined,
            getPartitionIds: () => undefined,
            getAdditionalFields: () => undefined,
            getVersion: () => undefined,
            getFetchOption: () => core.FetchOptions.OnlineOnly
        } as any);
    });

    it("Method QueryApi.getPartitionsById should be called with param additionalFields and run getPartitions method with additionalFields", async function() {
        const QueryClientStub = sandbox.stub(dataServiceRead, "QueryClient");

        const mockedPartitions = {
            partitions: [
                {
                    version: 41,
                    partition: "41",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123",
                    dataSize: "754211"
                },
                {
                    version: 42,
                    partition: "42",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123",
                    dataSize: "754212"
                }
            ]
        };

        class MockedQueryClient {
            getPartitionsById(
                request: dataServiceRead.PartitionsRequest,
                signal: AbortSignal
            ) {
                expect(request.getPartitionIds()).contains("23605706");
                expect(request.getAdditionalFields()).contains("dataSize");
                return Promise.resolve(mockedPartitions);
            }
        }

        QueryClientStub.callsFake((settings: core.OlpClientSettings) => {
            return new MockedQueryClient();
        });

        const partitionsRequest = new dataServiceRead.PartitionsRequest()
            .withPartitionIds(["23605706"])
            .withAdditionalFields(["dataSize"]);

        const partitions = await versionedLayerClient.getPartitions(
            partitionsRequest
        );
        expect(partitions).equals(mockedPartitions);
    });
});

describe("VersionedLayerClient with locked version 0 in constructor", function() {
    let sandbox: sinon.SinonSandbox;
    let client: dataServiceRead.VersionedLayerClient;

    const mockedCatalogHRH = core.HRN.fromString(
        "hrn:here:data:::example-catalog"
    );
    const mockedSettings = new core.OlpClientSettings({
        environment: "mocked-env",
        getToken: () => Promise.resolve("mocked-token")
    });

    before(function() {
        sandbox = sinon.createSandbox();
    });

    beforeEach(function() {
        client = new dataServiceRead.VersionedLayerClient({
            settings: mockedSettings,
            catalogHrn: mockedCatalogHRH,
            layerId: "mocked-layed-id",
            version: 0
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("Versioned layer should be initialized with 0 version", function() {
        expect(client !== undefined).to.be.true;
        expect(client["version"]).to.be.equal(0);
    });

    it("Versioned layer should be initialized with undefined version if user set some version less then 0 ", function() {
        const client = new dataServiceRead.VersionedLayerClient({
            settings: mockedSettings,
            catalogHrn: mockedCatalogHRH,
            layerId: "mocked-layed-id",
            version: -1
        });
        expect(client !== undefined).to.be.true;
        expect(client["version"]).to.be.equal(undefined);
    });

    it("Method getPartitions should call queryClient.fetchQuadTreeIndex with QuadTreeIndexRequest.getVersion() is 0", async function() {
        const QueryClientStub = sandbox.stub(dataServiceRead, "QueryClient");

        class MockedQueryClient {
            fetchQuadTreeIndex(
                request: dataServiceRead.QuadTreeIndexRequest,
                signal: AbortSignal
            ) {
                expect(request.getVersion()).to.be.equal(0);
            }
        }

        QueryClientStub.callsFake((settings: core.OlpClientSettings) => {
            return new MockedQueryClient();
        });

        await client.getPartitions(
            new dataServiceRead.QuadKeyPartitionsRequest().withQuadKey(
                core.TileKey.fromMortonCode(1000)
            )
        );
    });

    it("Method getData should not change the version of the layer", async function() {
        // @ts-ignore
        class VersionedLayerClientTest extends dataServiceRead.VersionedLayerClient {
            constructor(params: dataServiceRead.VersionedLayerClientParams) {
                super(params);
            }

            /**
             * @override
             */
            private downloadPartition(
                dataHandle: string,
                abortSignal?: AbortSignal,
                billingTag?: string
            ): Promise<Response> {
                return Promise.resolve(new Response());
            }
        }

        const client = new VersionedLayerClientTest({
            settings: mockedSettings,
            catalogHrn: mockedCatalogHRH,
            layerId: "mocked-layed-id",
            version: 0
        });
        await client.getData(
            new dataServiceRead.DataRequest().withDataHandle("fake-datahandle")
        );
        expect(client["version"]).to.be.equal(0);
    });

    it("Method getPartitions should call MetadataApi.getPartitions with param version equal 0", async function() {
        // @ts-ignore
        class VersionedLayerClientTest extends dataServiceRead.VersionedLayerClient {
            constructor(params: dataServiceRead.VersionedLayerClientParams) {
                super(params);
            }

            /**
             * @override
             */
            private getRequestBuilder(
                builderType: any,
                hrn?: any,
                abortSignal?: AbortSignal
            ): Promise<core.DataStoreRequestBuilder> {
                return Promise.resolve(new Response()) as any;
            }
        }

        const clientOvverided = new VersionedLayerClientTest({
            settings: mockedSettings,
            catalogHrn: mockedCatalogHRH,
            layerId: "mocked-layed-id",
            version: 0
        });

        const getPartitionsStub = sandbox.stub(MetadataApi, "getPartitions");

        getPartitionsStub.callsFake((builder, params: any) => {
            expect(params.version).eqls(0);
            return Promise.resolve({ partitions: [] }) as any;
        });

        await clientOvverided.getPartitions(
            new dataServiceRead.PartitionsRequest()
        );
    });
});
