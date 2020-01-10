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
import { MetadataApi, QueryApi, VolatileBlobApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VolatileLayerClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getPartitionsStub: sinon.SinonStub;
    let getBlobStub: sinon.SinonStub;
    let getVersionStub: sinon.SinonStub;
    let getPartitionsByIdStub: sinon.SinonStub;
    let getQuadTreeIndexStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let volatileLayerClient: dataServiceRead.VolatileLayerClient;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::live-weather-na"
    );
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        volatileLayerClient = new dataServiceRead.VolatileLayerClient(
            mockedHRN,
            mockedLayerId,
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
    });

    beforeEach(() => {
        getBlobStub = sandbox.stub(VolatileBlobApi, "getVolatileBlob");
        getPartitionsStub = sandbox.stub(MetadataApi, "getPartitions");
        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
        getPartitionsByIdStub = sandbox.stub(QueryApi, "getPartitionsById");
        getQuadTreeIndexStub = sandbox.stub(QueryApi, "quadTreeIndexVolatile");
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised", async () => {
        assert.isDefined(volatileLayerClient);
    });

    it("Should method getPartitions provide data with PartitionsRequest", async () => {
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

        const partitionsRequest = new dataServiceRead.PartitionsRequest();
        const partitions = await volatileLayerClient.getPartitions(
            partitionsRequest
        );

        assert.isDefined(partitions);
        expect(partitions).to.be.equal(mockedPartitions);
    });

    it("Should method getPartitions provide data with PartitionIds list", async () => {
        const mockedIds = ["1", "2", "13", "42"];
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

        const partitionsRequest = new dataServiceRead.PartitionsRequest().withPartitionIds(mockedIds);
        const partitions = await volatileLayerClient.getPartitions(
            partitionsRequest
        );

        assert.isDefined(partitions);
        expect(partitions).to.be.equal(mockedPartitions);
    });

    it("Should method getPartitions provide data with additionalFields parameter", async () => {
        const mockedPartitions = {
            partitions: [
                {
                    version: 42,
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

        const partitionsRequest = new dataServiceRead.PartitionsRequest().withAdditionalFields(
            ["dataSize", "checksum", "compressedDataSize"]
        );
        const partitionsResponse = await volatileLayerClient.getPartitions(
            partitionsRequest
        );
        assert.isDefined(partitionsResponse);

        // check if layer client sends a request for getPartitions with correct params
        expect(getPartitionsStub.getCalls()[0].args[1].additionalFields[0]).to.be.equal("dataSize");
        expect(getPartitionsStub.getCalls()[0].args[1].additionalFields[1]).to.be.equal("checksum");
        expect(getPartitionsStub.getCalls()[0].args[1].additionalFields[2]).to.be.equal("compressedDataSize");
    });   

    it("Should method getPartitions return error without QuadKeyPartitionsRequest", async () => {
        const mockedErrorResponse = "Please provide correct QuadKey";

        const quadKeyRequest = new dataServiceRead.QuadKeyPartitionsRequest();
        const partitions = await volatileLayerClient.getPartitions(quadKeyRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error);
            });
    });

    it("Should method getData provide data with dataHandle parameter", async () => {
        const mockedBlobData: Response = new Response("mocked-blob-response");
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        const dataRequest = new dataServiceRead.DataRequest().withDataHandle(
            "moсked-data-handle"
        );

        const response = await volatileLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData provide data with partitionId parameter", async () => {
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

        const response = await volatileLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData provide data with partitionId parameter and version", async () => {
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

        const dataRequest = new dataServiceRead.DataRequest()
            .withPartitionId("42")
            .withVersion(2);

        const response = await volatileLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData with partitionId parameter and version return error", async () => {
        const mockedErrorResponse = "some error";

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                throw new Error(mockedErrorResponse);
            }
        );

        const dataRequest = new dataServiceRead.DataRequest()
            .withPartitionId("42")
            .withVersion(2);

        const response = await volatileLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        )
        .catch(error => {
            assert.isDefined(error);
            assert.equal(mockedErrorResponse, error.message);
        });
    });

    it("Should method getData with wrong partitionId parameter and version return error", async () => {
        const mockedBlobData = new Response("mocked-blob-response");
        const mockedErrorResponse = "No partition dataHandle for partition 42. HRN: hrn:here:data:::live-weather-na";
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

        const dataRequest = new dataServiceRead.DataRequest()
            .withPartitionId("42")
            .withVersion(2);

        const response = await volatileLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        ).catch(error => {
            assert.isDefined(error);
            assert.equal(mockedErrorResponse, error);
        });
    });

    it("Should method getData provide data with quadKey", async () => {
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
            (builder: any, params: any): Promise<QueryApi.Index> => {
                return Promise.resolve(mockedQuadKeyTreeData);
            }
        );
        getVersionStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );
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
        getBlobStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedBlobData);
            }
        );

        const dataRequest = new dataServiceRead.DataRequest().withQuadKey(
            dataServiceRead.quadKeyFromMortonCode("23618403")
        );

        const response = await volatileLayerClient.getData(dataRequest as any);
        assert.isDefined(response);
    });

    it("Should method getData return Error without dataRequest parameters", async () => {
        const mockedErrorResponse =
            "No data provided. Add dataHandle, partitionId or quadKey to the DataRequest object";
        const dataRequest = new dataServiceRead.DataRequest();

        const response = await volatileLayerClient
            .getData(dataRequest as any)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getData return Error with correct partitionId and wrong layerId", async () => {
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        const volatileClient = new dataServiceRead.VolatileLayerClient(
            mockedHRN,
            "mockedLayerId",
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );

        const dataRequest = new dataServiceRead.DataRequest().withPartitionId(
            "42"
        );

        const mockedPartitionsIdData = {
            status: 400,
            title: "Bad request",
            detail: [
                {
                    name: "layer",
                    error: "Layer 'mockedLayerId' is missing in the catalog configuration."
                }
            ]
        };

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): any => {
                return Promise.resolve(mockedPartitionsIdData);
            }
        );

        const response = await volatileClient
            .getData((dataRequest as unknown) as dataServiceRead.DataRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(error, mockedPartitionsIdData);
            });
    });

    it("Should method getData return Error with correct quadKey and wrong version parameter", async () => {
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        const volatileClient = new dataServiceRead.VolatileLayerClient(
            mockedHRN,
            "mockedLayerId",
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
        const dataRequest = new dataServiceRead.DataRequest().withQuadKey(
            dataServiceRead.quadKeyFromMortonCode("23618403")
        );

        const mockedPartitionsIdData = {
            status: 400,
            title: "Bad request",
            detail: [
                {
                    name: "layer",
                    error: "Layer 'mockedLayerId' is missing in the catalog configuration."
                }
            ]
        };

        const mockedVersion = {
            version: 42
        };

        getVersionStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        getQuadTreeIndexStub.callsFake(
            (builder: any, params: any): any => {
                return Promise.resolve(mockedPartitionsIdData);
            }
        );

        const response = await volatileClient
            .getData((dataRequest as unknown) as dataServiceRead.DataRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(error, mockedPartitionsIdData);
            });
    });

});
