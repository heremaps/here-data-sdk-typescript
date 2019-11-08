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

import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import { BlobApi, MetadataApi, QueryApi } from "@here/olp-sdk-dataservice-api";
import * as utils from "@here/olp-sdk-dataservice-read/lib/partitioning/QuadKeyUtils";
import { Index } from "@here/olp-sdk-dataservice-api/lib/query-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VersionedLayerClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getBlobStub: sinon.SinonStub;
    let getPartitionsByIdStub: sinon.SinonStub;
    let getQuadTreeIndexStub: sinon.SinonStub;
    let getVersionStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let versionedLayerClient: dataServiceRead.VersionedLayerClient;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::live-weather-na"
    );
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = sinon.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        versionedLayerClient = new dataServiceRead.VersionedLayerClient(
            mockedHRN,
            mockedLayerId,
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
    });

    beforeEach(() => {
        getBlobStub = sandbox.stub(BlobApi, "getBlob");
        getPartitionsByIdStub = sandbox.stub(QueryApi, "getPartitionsById");
        getQuadTreeIndexStub = sandbox.stub(QueryApi, "quadTreeIndex");
        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
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
        assert.isDefined(versionedLayerClient);
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

        const response = await versionedLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData provide data with partitionId parameter", async () => {
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

        const response = await versionedLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData provide data with partitionId quadKey", async () => {
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

        const dataRequest = new dataServiceRead.DataRequest().withQuadKey(
            utils.quadKeyFromMortonCode("23618403")
        );

        const response = await versionedLayerClient.getData(
            (dataRequest as unknown) as dataServiceRead.DataRequest
        );
        assert.isDefined(response);
        assert.isTrue(response.ok);
    });

    it("Should method getData return Error without dataRequest parameters", async () => {
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
});
