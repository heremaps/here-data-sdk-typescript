/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
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
import { MetadataApi, QueryApi } from "@here/olp-sdk-dataservice-api";
import * as core from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("QueryClient", function() {
    let sandbox: sinon.SinonSandbox;
    let getVersionStub: sinon.SinonStub;
    let getPartitionsByIdStub: sinon.SinonStub;
    let quadTreeIndexVolatileStub: sinon.SinonStub;
    let olpClientSettingsStub: sinon.SinonStubbedInstance<core.OlpClientSettings>;

    let getBaseUrlRequestStub: sinon.SinonStub;
    const mockedHRN = core.HRN.fromString("hrn:here:data:::mocked-hrn");
    const mockedLayerId = "mocked-layed-id";
    const mockedLayerType = "volatile";
    const fakeURL = "http://fake-base.url";
    const mockedQuadKey = {
        row: 1,
        column: 2,
        level: 3
    };

    before(function() {
        sandbox = sinon.createSandbox();
    });

    beforeEach(function() {
        olpClientSettingsStub = sandbox.createStubInstance(
            core.OlpClientSettings
        );
        quadTreeIndexVolatileStub = sandbox.stub(
            QueryApi,
            "quadTreeIndexVolatile"
        );
        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
        getPartitionsByIdStub = sandbox.stub(QueryApi, "getPartitionsById");
        getBaseUrlRequestStub = sandbox.stub(core.RequestFactory, "getBaseUrl");

        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("Shoud be initialised with settings", async function() {
        const queryClient = new dataServiceRead.QueryClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(queryClient);
    });

    it("Should method fetchQuadTreeIndex provide data with all parameters", async function() {
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
        const queryClient = new dataServiceRead.QueryClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(queryClient);

        quadTreeIndexVolatileStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Index> => {
                return Promise.resolve(mockedQuadKeyTreeData);
            }
        );

        const quadTreeIndexRequest = new dataServiceRead.QuadTreeIndexRequest(
            mockedHRN,
            mockedLayerId,
            mockedLayerType
        )
            .withQuadKey(mockedQuadKey)
            .withVersion(42);

        const response = await queryClient.fetchQuadTreeIndex(
            quadTreeIndexRequest
        );

        assert.isDefined(response);
        expect(response).to.be.equal(mockedQuadKeyTreeData);
    });

    it("Should method fetchQuadTreeIndex return error if quadKey is not provided", async function() {
        const mockedErrorResponse = "Please provide correct QuadKey";
        const queryClient = new dataServiceRead.QueryClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(queryClient);

        const quadTreeIndexRequest = new dataServiceRead.QuadTreeIndexRequest(
            mockedHRN,
            mockedLayerId,
            mockedLayerType
        );

        const result = await queryClient
            .fetchQuadTreeIndex(quadTreeIndexRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error);
            });
    });

    it("Should method fetchQuadTreeIndex return error if layerId is not provided", async function() {
        const mockedErrorResponse = "Please provide correct Id of the Layer";
        const queryClient = new dataServiceRead.QueryClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(queryClient);

        const quadTreeIndexRequest = new dataServiceRead.QuadTreeIndexRequest(
            mockedHRN,
            "",
            mockedLayerType
        ).withQuadKey(mockedQuadKey);

        const result = await queryClient
            .fetchQuadTreeIndex(quadTreeIndexRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error);
            });
    });

    it("Should method fetchQuadTreeIndex return error if catalog version is not provided", async function() {
        const mockedErrorResponse = `Please provide correct catalog version`;
        const queryClient = new dataServiceRead.QueryClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(queryClient);

        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve({ version: NaN });
            }
        );

        const quadTreeIndexRequest = new dataServiceRead.QuadTreeIndexRequest(
            mockedHRN,
            mockedLayerId,
            mockedLayerType
        ).withQuadKey(mockedQuadKey);

        const result = await queryClient
            .fetchQuadTreeIndex(quadTreeIndexRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error);
            });
    });

    it("Should method fetchQuadTreeIndex return error if catalog version is not provided", async function() {
        const mockedError = "Unknown error";
        const mockedErrorResponse = `Error getting the last catalog version: ${mockedError}`;
        const queryClient = new dataServiceRead.QueryClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(queryClient);

        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.reject(mockedError);
            }
        );

        const quadTreeIndexRequest = new dataServiceRead.QuadTreeIndexRequest(
            mockedHRN,
            mockedLayerId,
            mockedLayerType
        ).withQuadKey(mockedQuadKey);

        const result = await queryClient
            .fetchQuadTreeIndex(quadTreeIndexRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error);
            });
    });

    it("Should method getPartitionsById provide data with all parameters", async function() {
        const mockedIds = ["1", "2", "13", "42"];
        const mockedLayerId = "fake-layer-id";
        const mockedHRN = core.HRN.fromString("hrn:here:data:::mocked-hrn");
        const mockedPartitionsResponse = {
            partitions: [
                {
                    checksum: "291f66029c232400e3403cd6e9cfd36e",
                    compressedDataSize: 1024,
                    dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
                    dataSize: 1024,
                    crc: "c3f276d7",
                    partition: "314010583",
                    version: 2
                }
            ]
        };

        const queryClient = new dataServiceRead.QueryClient(
            new core.OlpClientSettings({
                environment: "mocked-env",
                getToken: () => Promise.resolve("Mocked-token")
            })
        );
        assert.isDefined(queryClient);

        getPartitionsByIdStub.callsFake(
            (builder: any, params: any): Promise<QueryApi.Partitions> => {
                return Promise.resolve(mockedPartitionsResponse);
            }
        );

        const partitionsRequest = new dataServiceRead.PartitionsRequest()
            .withVersion(42)
            .withPartitionIds(mockedIds);

        const response = await queryClient.getPartitionsById(
            partitionsRequest,
            mockedLayerId,
            mockedHRN
        );

        assert.isDefined(response);
        expect(response).to.be.equal(mockedPartitionsResponse);
    });

    it("Should method getPartitionsById return error if partitionIds list is not provided", async function() {
        const mockedErrorResponse = "Please provide correct partitionIds list";
        const mockedLayerId = "fake-layer-id";
        const mockedHRN = core.HRN.fromString("hrn:here:data:::mocked-hrn");
        const queryClient = new dataServiceRead.QueryClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(queryClient);

        const partitionsRequest = new dataServiceRead.PartitionsRequest();

        const response = await queryClient
            .getPartitionsById(partitionsRequest, mockedLayerId, mockedHRN)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error);
            });
    });
});
