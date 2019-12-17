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

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import {
  VersionedLayerClient,
  OlpClientSettings,
  HRN,
  PartitionsRequest,
  DataRequest,
  quadKeyFromMortonCode,
  QuadKeyPartitionsRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";
import { Buffer } from "buffer";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VersionedLayerClient", () => {
    let fetchMock: FetchMock;
    let sandbox: sinon.SinonSandbox;
    let fetchStub: sinon.SinonStub;

    const testHRN = HRN.fromString("hrn:here:data:::test-hrn");
    const testLayerId = "test-layed-id";

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
    sandbox.restore();
    });

    beforeEach(() => {
    fetchMock = new FetchMock();
    fetchStub = sandbox.stub(global as any, "fetch");
    fetchStub.callsFake(fetchMock.fetch());
    });

    it("Shoud be initialised with settings", async () => {
        const settings = new OlpClientSettings({
            environment: "here",
            getToken: () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(
            HRN.fromString("hrn:here:data:::test-hrn"),
            "test-layed-id",
            settings
        );
        assert.isDefined(layerClient);
        expect(layerClient).to.be.instanceOf(VersionedLayerClient);
    });

    it("Shoud be fetched partitions metadata for specific IDs", async () => {
        const mockedResponses = new Map();

        // Set the response from lookup api with the info about Query API.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1`,
            new Response(
            JSON.stringify([
                {
                api: "query",
                version: "v1",
                baseURL: "https://query.data.api.platform.here.com/query/v1",
                parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                }
                }
            ])
            )
        );

        // Set the response with mocked partitions for IDs 100 and 1000 from Query service
        mockedResponses.set(
            `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/partitions?partition=100&partition=1000`,
            new Response(
            JSON.stringify({
                partitions: [
                {
                    checksum: "291f66029c232400e3403cd6e9cfd36e",
                    compressedDataSize: 1024,
                    dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
                    dataSize: 1024,
                    crc: "c3f276d7",
                    partition: "100",
                    version: 2
                },
                {
                    checksum: "123f66029c232400e3403cd6e9cfd45b",
                    compressedDataSize: 2084,
                    dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640578e",
                    dataSize: 2084,
                    crc: "c3f2766y",
                    partition: "1000",
                    version: 2
                }
                ]
            })
            )
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        // Setup Layer Client with new OlpClientSettings.
        const settings = new OlpClientSettings({
            environment: "here",
            getToken: () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(
            HRN.fromString("hrn:here:data:::test-hrn"),
            "test-layed-id",
            settings
        );

        // Setup PartitionsRequest to filter response by partition IDs 100 and 1000.
        const request = new PartitionsRequest().withPartitionIds(["100", "1000"]);

        // Send request for partitions metadata.
        const partitions = await layerClient.getPartitions(request).catch(error => {
            console.log(`Error getting partitions: ${error}`);
        });

        // Check if partitions fetched succesful.
        assert.isDefined(partitions);

        if (partitions) {
            // Check if partitions returns as expected.
            expect(partitions.partitions[0].dataHandle).to.be.equal(
            "1b2ca68f-d4a0-4379-8120-cd025640510c"
            );
            expect(partitions.partitions[1].dataHandle).to.be.equal(
            "1b2ca68f-d4a0-4379-8120-cd025640578e"
            );
            expect(partitions.partitions[2]).to.be.undefined;

            /**
             * Check if the count of requests are as expected. Should be called 2 times. One to the lookup service
             * for the baseURL to the Query service and another one to the query service.
             */
            expect(fetchStub.callCount).to.be.equal(2);
        }
    });

    it("Shoud be fetched partitions all metadata", async () => {
        const mockedResponses = new Map();

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/metadata/v1`,
            new Response(
            JSON.stringify([
                {
                    api: "metadata",
                    version: "v1",
                    baseURL: "https://metadata.data.api.platform.here.com/metadata/v1",
                    parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                    }
                }
                ])
            )
        );

        // Set the response from Metadata service with the info about latest catalog version.
        mockedResponses.set(
            `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
            new Response(JSON.stringify({"version": 128}))
        );

        // Set the response of mocked partitions from metadata service.
        mockedResponses.set(
            `https://metadata.data.api.platform.here.com/metadata/v1/layers/test-layed-id/partitions?version=128`,
            new Response(JSON.stringify(
                {
                    "partitions": [
                        {
                        "checksum": "291f66029c232400e3403cd6e9cfd36e",
                        "compressedDataSize": 1024,
                        "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640510c",
                        "dataSize": 1024,
                        "crc": "c3f276d7",
                        "partition": "314010583",
                        "version": 1
                        },
                        {
                        "checksum": "123f66029c232400e3403cd6e9cfd45b",
                        "compressedDataSize": 2084,
                        "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640578e",
                        "dataSize": 2084,
                        "crc": "c3f2766y",
                        "partition": "1000",
                        "version": 2
                        },
                        {
                        "checksum": "123f66029c232400e3403cd6e9cfd345",
                        "compressedDataSize": 2084,
                        "dataHandle": "1b2ca68f-d4a0-4379-8120-cd0256405444",
                        "dataSize": 2084,
                        "crc": "c3f2766y",
                        "partition": "1000",
                        "version": 2
                        },{
                        "checksum": "123f66029c232400e3403cd6e9cfd234",
                        "compressedDataSize": 2084,
                        "dataHandle": "1b2ca68f-d4a0-4379-8120-cd0256405555",
                        "dataSize": 2084,
                        "crc": "c3f2766y",
                        "partition": "1000",
                        "version": 2
                        }
                    ],
                    "next": "/uri/to/next/page"
                    }
            ))
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        // Setup Layer Client with new OlpClientSettings.
        const settings = new OlpClientSettings({
            environment: "here",
            getToken: () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(
            HRN.fromString("hrn:here:data:::test-hrn"),
            "test-layed-id",
            settings
        );

        // Setup PartitionsRequest without any parameters
        const request = new PartitionsRequest();

        // Send request for partitions metadata.
        const partitions = await layerClient.getPartitions(request).catch(error => {
            console.log(`Error getting partitions: ${error}`);
        });

        // Check if partitions fetched succesful.
        assert.isDefined(partitions);

        if (partitions) {
            // Check if partitions returns as expected.
            expect(partitions.partitions[0].dataHandle).to.be.equal(
                "1b2ca68f-d4a0-4379-8120-cd025640510c"
            );
            expect(partitions.partitions[1].dataHandle).to.be.equal(
                "1b2ca68f-d4a0-4379-8120-cd025640578e"
            );
            expect(partitions.partitions.length).to.be.equal(4);
        }

        /**
         * Check if the count of requests are as expected. Should be called 3 times. One to the lookup service
         * for the baseURL to the Metadata service, the second one to the Metadata service for getting the latest version
         * of catalog and another one to the metadata service for the partitions metadata.
         */
        expect(fetchStub.callCount).to.be.equal(3);
    });

    it("Shoud be fetched data with dataHandle", async () => {
        const mockedResponses = new Map();
        const mockedDataHandle = "1b2ca68f-d4a0-4379-8120-cd025640510c";
        const mockedData = Buffer.alloc(42);

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/blob/v1`,
            new Response(
            JSON.stringify([
                {
                    api: "blob",
                    version: "v1",
                    baseURL: "https://blob.data.api.platform.here.com/blob/v1",
                    parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                    }
                }
                ])
            )
        );

        // Set the response of mocked partitions from metadata service.
        mockedResponses.set(
            `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
            new Response(mockedData)
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(testHRN, testLayerId, settings);
        const request = new DataRequest().withDataHandle(mockedDataHandle);

        const data = await layerClient.getData(request);

        assert.isDefined(data);
        expect(fetchStub.callCount).to.be.equal(2);
    });

    it("Shoud be fetched data with PartitionId", async () => {
        const mockedResponses = new Map();
        const mockedPartitionId = "0000042";
        const mockedData = Buffer.alloc(42);
        const mockedPartitionsIdData = {
            partitions: [
                {
                    version: 1,
                    partition: "0000042",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                },
                {
                    version: 42,
                    partition: "0000013",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };

        mockedResponses.set(
            `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/partitions?partition=0000042&version=42`,
            new Response(
                JSON.stringify(mockedPartitionsIdData)
            )
        );

        mockedResponses.set(
            `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
            new Response(
                JSON.stringify({ version: 42 })
            )
        );

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/metadata/v1`,
            new Response(
            JSON.stringify([
                {
                    api: "metadata",
                    version: "v1",
                    baseURL: "https://metadata.data.api.platform.here.com/metadata/v1",
                    parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                    }
                }
                ])
            )
        );

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/blob/v1`,
            new Response(
            JSON.stringify([
                {
                    api: "blob",
                    version: "v1",
                    baseURL: "https://blob.data.api.platform.here.com/blob/v1",
                    parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                    }
                }
                ])
            )
        );

        // Set the response from lookup api with the info about Query API.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1`,
            new Response(
            JSON.stringify([
                {
                api: "query",
                version: "v1",
                baseURL: "https://query.data.api.platform.here.com/query/v1",
                parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                }
                }
            ])
            )
        );

        // Set the response of mocked partitions from metadata service.
        mockedResponses.set(
            `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/3C3BE24A341D82321A9BA9075A7EF498.123`,
            new Response(mockedData)
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(testHRN, testLayerId, settings);
        const request = new DataRequest().withPartitionId(mockedPartitionId);

        const data = await layerClient.getData(request);

        assert.isDefined(data);
        expect(fetchStub.callCount).to.be.equal(6);
    });

    it("Shoud be fetched data with PartitionId and version", async () => {
        const mockedResponses = new Map();
        const mockedPartitionId = "0000042";
        const mockedData = Buffer.alloc(42);
        const mockedPartitionsIdData = {
            partitions: [
                {
                    version: 1,
                    partition: "0000042",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                },
                {
                    version: 42,
                    partition: "0000013",
                    dataHandle: "3C3BE24A341D82321A9BA9075A7EF498.123"
                }
            ]
        };

        mockedResponses.set(
            `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/partitions?partition=0000042&version=42`,
            new Response(
                JSON.stringify(mockedPartitionsIdData)
            )
        );

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/blob/v1`,
            new Response(
                JSON.stringify([
                    {
                        api: "blob",
                        version: "v1",
                        baseURL: "https://blob.data.api.platform.here.com/blob/v1",
                        parameters: {
                            additionalProp1: "string",
                            additionalProp2: "string",
                            additionalProp3: "string"
                        }
                    }
                ])
            )
        );

        // Set the response from lookup api with the info about Query API.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1`,
            new Response(
            JSON.stringify([
                {
                api: "query",
                version: "v1",
                baseURL: "https://query.data.api.platform.here.com/query/v1",
                parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                }
                }
            ])
            )
        );

        // Set the response of mocked partitions from metadata service.
        mockedResponses.set(
            `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/3C3BE24A341D82321A9BA9075A7EF498.123`,
            new Response(mockedData)
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(testHRN, testLayerId, settings);
        const request = new DataRequest().withPartitionId(mockedPartitionId).withVersion(42);

        const data = await layerClient.getData(request);

        assert.isDefined(data);
        expect(fetchStub.callCount).to.be.equal(4);
    });

    it("Shoud be fetched data with QuadKey", async () => {
        const mockedResponses = new Map();
        const mockedQuadKey = quadKeyFromMortonCode("23618403");
        const mockedData = Buffer.alloc(42);
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

        mockedResponses.set(
            `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/versions/42/quadkeys/23618403/depths/0`,
            new Response(
                JSON.stringify(mockedQuadKeyTreeData)
            )
        );

        mockedResponses.set(
            `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
            new Response(
                JSON.stringify({ version: 42 })
            )
        );

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/metadata/v1`,
            new Response(
            JSON.stringify([
                {
                    api: "metadata",
                    version: "v1",
                    baseURL: "https://metadata.data.api.platform.here.com/metadata/v1",
                    parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                    }
                }
                ])
            )
        );

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/blob/v1`,
            new Response(
            JSON.stringify([
                {
                    api: "blob",
                    version: "v1",
                    baseURL: "https://blob.data.api.platform.here.com/blob/v1",
                    parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                    }
                }
                ])
            )
        );

        // Set the response from lookup api with the info about Query API.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1`,
            new Response(
            JSON.stringify([
                {
                api: "query",
                version: "v1",
                baseURL: "https://query.data.api.platform.here.com/query/v1",
                parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                }
                }
            ])
            )
        );

        // Set the response of mocked partitions from metadata service.
        mockedResponses.set(
            `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665`,
            new Response(mockedData)
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(testHRN, testLayerId, settings);
        const request = new DataRequest().withQuadKey(mockedQuadKey);

        const data = await layerClient.getData(request);

        assert.isDefined(data);
        expect(fetchStub.callCount).to.be.equal(6);
    });

    it("Shoud be fetched data with QuadKey and Version", async () => {
        const mockedResponses = new Map();
        const mockedQuadKey = quadKeyFromMortonCode("23618403");
        const mockedData = Buffer.alloc(42);
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

        mockedResponses.set(
            `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/versions/42/quadkeys/23618403/depths/0`,
            new Response(
                JSON.stringify(mockedQuadKeyTreeData)
            )
        );

        // Set the response from lookup api with the info about Metadata service.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/blob/v1`,
            new Response(
            JSON.stringify([
                {
                    api: "blob",
                    version: "v1",
                    baseURL: "https://blob.data.api.platform.here.com/blob/v1",
                    parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                    }
                }
                ])
            )
        );

        // Set the response from lookup api with the info about Query API.
        mockedResponses.set(
            `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1`,
            new Response(
            JSON.stringify([
                {
                api: "query",
                version: "v1",
                baseURL: "https://query.data.api.platform.here.com/query/v1",
                parameters: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string"
                }
                }
            ])
            )
        );

        // Set the response of mocked partitions from metadata service.
        mockedResponses.set(
            `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665`,
            new Response(mockedData)
        );

        // Setup the fetch to use mocked responses.
        fetchMock.withMockedResponses(mockedResponses);

        const settings = new OlpClientSettings({
            environment: "here",
            "getToken": () => Promise.resolve("test-token-string")
        });
        const layerClient = new VersionedLayerClient(testHRN, testLayerId, settings);
        const request = new DataRequest().withQuadKey(mockedQuadKey).withVersion(42);

        const data = await layerClient.getData(request);

        assert.isDefined(data);
        expect(fetchStub.callCount).to.be.equal(4);
    });

    it("Shoud read partitions metadata by QuadKey for specific VersionLayer", async () => {
      const mockedResponses = new Map();

      const billingTag = "billingTag";
      const mockedVersion = 42;
      const mockedDepth = 3;
      const mockedQuadKey = {
        row: 1,
        column: 2,
        level: 3
      };
  
      // Set the response from lookup api with the info about Query API.
      mockedResponses.set(
        `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1`,
        new Response(
          JSON.stringify([
            {
              api: "query",
              version: "v1",
              baseURL: "https://query.data.api.platform.here.com/query/v1",
              parameters: {
                additionalProp1: "string",
                additionalProp2: "string",
                additionalProp3: "string"
              }
            }
          ])
        )
      );
  
      // Set the response with mocked partitions
      mockedResponses.set(
        `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/versions/42/quadkeys/70/depths/3`,
        new Response(
          JSON.stringify({
            parentQuads: [
              {
                additionalMetadata: "string",
                checksum: "string",
                compressedDataSize: 0,
                dataHandle: "675911FF6236B7C7604BF8B105F1BB58",
                dataSize: 0,
                crc: "c3f276d7",
                partition: "73982",
                version: 0
              }
            ],
            subQuads: [
              {
                additionalMetadata: "string",
                checksum: "291f66029c232400e3403cd6e9cfd36e",
                compressedDataSize: 200,
                dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
                dataSize: 1024,
                crc: "c3f276d7",
                subQuadKey: "string",
                version: 1
              }
            ]
          })
        )
      );
  
      // Setup the fetch to use mocked responses.
      fetchMock.withMockedResponses(mockedResponses);
  
      // Setup Layer Client with new OlpClientSettings.
      const settings = new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      });
      const layerClient = new VersionedLayerClient(
        HRN.fromString("hrn:here:data:::test-hrn"),
        "test-layed-id",
        settings
      );
  
      const quadKeyPartitionsRequest = new QuadKeyPartitionsRequest();  
      assert.isDefined(quadKeyPartitionsRequest);
      expect(quadKeyPartitionsRequest).be.instanceOf(QuadKeyPartitionsRequest); 
  
      const quadKeyPartitionsRequestWithVersion = quadKeyPartitionsRequest.withVersion(
        mockedVersion
      );
      const quadKeyPartitionsRequestWithDepth = quadKeyPartitionsRequest.withDepth(
        mockedDepth
      );
      const quadKeyPartitionsRequestWithQuadKey = quadKeyPartitionsRequest.withQuadKey(
        mockedQuadKey
      );
      const quadKeyPartitionsRequestWithBillTag = quadKeyPartitionsRequest.withBillingTag(
        billingTag
      );

      expect(quadKeyPartitionsRequestWithVersion.getVersion()).to.be.equal(mockedVersion);
      expect(quadKeyPartitionsRequestWithDepth.getDepth()).to.be.equal(mockedDepth);
      expect(quadKeyPartitionsRequestWithQuadKey.getQuadKey()).to.be.equal(mockedQuadKey);
      expect(quadKeyPartitionsRequestWithBillTag.getBillingTag()).to.be.equal(billingTag);
  
      const partitions = await layerClient.getPartitions(
        quadKeyPartitionsRequest
      );
  
      expect(partitions.parentQuads[0].partition).to.be.equal(
        "73982"
      );
    });
});
