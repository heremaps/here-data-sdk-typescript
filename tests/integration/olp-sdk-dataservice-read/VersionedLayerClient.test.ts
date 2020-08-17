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
  QuadKeyPartitionsRequest,
  FetchOptions,
  TileRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "../FetchMock";
import { Buffer } from "buffer";
import { LIB_VERSION } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VersionedLayerClient", function() {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;

  const testHRN = HRN.fromString("hrn:here:data:::test-hrn");
  const testLayerId = "test-layed-id";
  const headers = new Headers();
  headers.append("cache-control", "max-age=3600");

  before(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(function() {
    fetchMock = new FetchMock();
    fetchStub = sandbox.stub(global as any, "fetch");
    fetchStub.callsFake(fetchMock.fetch());
  });

  it("Shoud be initialized with settings", async function() {
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

  it("Shoud be initialization error be handled", async function() {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    try {
      const layerClient = new VersionedLayerClient(
        HRN.fromString("hrn:here:data:::test-hrn"),
        "",
        settings
      );
    } catch (error) {
      expect(error.message).equal("Unsupported parameters");
    }
  });

  it("Shoud be initialized with VersionedLayerClientParams with version", async function() {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });

    const versionedLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings,
      version: 5
    };
    const layerClientWithVersion = new VersionedLayerClient(
      versionedLayerClientParams
    );
    assert.isDefined(layerClientWithVersion);
    expect(layerClientWithVersion).to.be.instanceOf(VersionedLayerClient);
  });

  it("Shoud be initialised with VersionedLayerClientParams without version", async function() {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });

    const versionedLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings
    };
    const layerClientWithoutVersion = new VersionedLayerClient(
      versionedLayerClientParams
    );
    assert.isDefined(layerClientWithoutVersion);
    expect(layerClientWithoutVersion).to.be.instanceOf(VersionedLayerClient);
  });

  it("Shoud be fetched partitions metadata for specific IDs", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Query API.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
          {
            api: "metadata",
            version: "v1",
            baseURL: "https://query.data.api.platform.here.com/metadata/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ]),
        { headers }
      )
    );

    mockedResponses.set(
      `https://query.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 128 }), { headers })
    );

    // Set the response with mocked partitions for IDs 100 and 1000 from Query service
    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/partitions?partition=100&partition=1000&version=128`,
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
        }),
        { headers }
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
       * Check if the count of requests are as expected. Should be called 3 times.
       * One to the lookup service
       * for the baseURL to the Query service, one for the latest version,
       * and last one to the query service.
       */
      expect(fetchStub.callCount).to.be.equal(3);
    }
  });

  it("Shoud be fetched partitions all metadata", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
        ]),
        { headers }
      )
    );

    // Set the response from Metadata service with the info about latest catalog version.
    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 128 }), { headers })
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/layers/test-layed-id/partitions?version=128`,
      new Response(
        JSON.stringify({
          partitions: [
            {
              checksum: "291f66029c232400e3403cd6e9cfd36e",
              compressedDataSize: 1024,
              dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
              dataSize: 1024,
              crc: "c3f276d7",
              partition: "314010583",
              version: 1
            },
            {
              checksum: "123f66029c232400e3403cd6e9cfd45b",
              compressedDataSize: 2084,
              dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640578e",
              dataSize: 2084,
              crc: "c3f2766y",
              partition: "1000",
              version: 2
            },
            {
              checksum: "123f66029c232400e3403cd6e9cfd345",
              compressedDataSize: 2084,
              dataHandle: "1b2ca68f-d4a0-4379-8120-cd0256405444",
              dataSize: 2084,
              crc: "c3f2766y",
              partition: "1000",
              version: 2
            },
            {
              checksum: "123f66029c232400e3403cd6e9cfd234",
              compressedDataSize: 2084,
              dataHandle: "1b2ca68f-d4a0-4379-8120-cd0256405555",
              dataSize: 2084,
              crc: "c3f2766y",
              partition: "1000",
              version: 2
            }
          ],
          next: "/uri/to/next/page"
        }),
        { headers }
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

    // Setup PartitionsRequest without any parameters
    const request = new PartitionsRequest();

    // Send request for partitions metadata.
    const partitions = await layerClient.getPartitions(request);

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
     * Check if the count of requests are as expected.
     * Should be called 3 times. One to the lookup service
     * for the baseURL to the Metadata service, the second
     * one to the Metadata service for getting the latest version
     * of catalog and another one to the metadata service for the partitions metadata.
     */
    expect(fetchStub.callCount).to.be.equal(3);
  });

  it("Shoud be fetched data with dataHandle", async function() {
    const mockedResponses = new Map();
    const mockedDataHandle = "1b2ca68f-d4a0-4379-8120-cd025640510c";
    const mockedData = Buffer.alloc(42);

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
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
        ]),
        { headers }
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(mockedData, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      testHRN,
      testLayerId,
      settings
    );
    const request = new DataRequest().withDataHandle(mockedDataHandle);

    const data = await layerClient.getData(request);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(2); // 1 - lookup, 1 - blob
  });

  it("Shoud be fetched data with PartitionId", async function() {
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
      new Response(JSON.stringify(mockedPartitionsIdData), { headers })
    );

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 42 }), { headers })
    );

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
          {
            api: "metadata",
            version: "v1",
            baseURL: "https://metadata.data.api.platform.here.com/metadata/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          },
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
        ]),
        { headers }
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/3C3BE24A341D82321A9BA9075A7EF498.123`,
      new Response(mockedData, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      testHRN,
      testLayerId,
      settings
    );
    const request = new DataRequest().withPartitionId(mockedPartitionId);

    const data = await layerClient.getData(request);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(4);
  });

  it("Shoud be fetched data with PartitionId and version", async function() {
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
      new Response(JSON.stringify(mockedPartitionsIdData), { headers })
    );

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
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
        ]),
        { headers }
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/3C3BE24A341D82321A9BA9075A7EF498.123`,
      new Response(mockedData, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      testHRN,
      testLayerId,
      settings
    );
    const request = new DataRequest()
      .withPartitionId(mockedPartitionId)
      .withVersion(42);

    const data = await layerClient.getData(request);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(3); // 1 - lookup, 1 - query, 1 - blob
  });

  it("Shoud be fetched data with QuadKey", async function() {
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
      new Response(JSON.stringify(mockedQuadKeyTreeData), { headers })
    );

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 42 }), { headers })
    );

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
          {
            api: "blob",
            version: "v1",
            baseURL: "https://blob.data.api.platform.here.com/blob/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          },
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
        ]),
        { headers }
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665`,
      new Response(mockedData, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      testHRN,
      testLayerId,
      settings
    );
    const request = new DataRequest().withQuadKey(mockedQuadKey);

    const data = await layerClient.getData(request);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(4);
  });

  it("Shoud be fetched data with QuadKey and Version", async function() {
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
      new Response(JSON.stringify(mockedQuadKeyTreeData), { headers })
    );

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
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
        ]),
        { headers }
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/c9116bb9-7d00-44bf-9b26-b4ab4c274665`,
      new Response(mockedData, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      testHRN,
      testLayerId,
      settings
    );
    const request = new DataRequest()
      .withQuadKey(mockedQuadKey)
      .withVersion(42);

    const data = await layerClient.getData(request);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(3); // 1 - lookup, 1 - query, 1 - blob
  });

  it("Shoud read partitions metadata by QuadKey for specific VersionLayer", async function() {
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
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
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
        ]),
        { headers }
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
        }),
        { headers }
      )
    );

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1&billingTag=billingTag`,
      new Response(JSON.stringify({ version: 42 }), { headers })
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

    expect(quadKeyPartitionsRequestWithVersion.getVersion()).to.be.equal(
      mockedVersion
    );
    expect(quadKeyPartitionsRequestWithDepth.getDepth()).to.be.equal(
      mockedDepth
    );
    expect(quadKeyPartitionsRequestWithQuadKey.getQuadKey()).to.be.equal(
      mockedQuadKey
    );
    expect(quadKeyPartitionsRequestWithBillTag.getBillingTag()).to.be.equal(
      billingTag
    );

    const partitions = await layerClient.getPartitions(
      quadKeyPartitionsRequest
    );

    if (partitions.parentQuads) {
      expect(partitions.parentQuads[0].partition).to.be.equal("73982");
    }
  });

  it("Shoud read partitions with additionalFields parameter from PartitionsRequest", async function() {
    const mockedResponses = new Map();

    const mockedPartitions = {
      partitions: [
        {
          checksum: "291f66029c232400e3403cd6e9cfd36e",
          compressedDataSize: 1024,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
          dataSize: 1024,
          crc: "c3f276d7",
          partition: "314010583"
        },
        {
          checksum: "123f66029c232400e3403cd6e9cfd45b",
          compressedDataSize: 2084,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640578e",
          dataSize: 2084,
          crc: "c3f2766y",
          partition: "1000"
        }
      ],
      next: "/uri/to/next/page"
    };

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
        ]),
        { headers }
      )
    );

    // Set the response from Metadata service with the info about latest catalog version.
    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1&billingTag=billing-tag`,
      new Response(JSON.stringify({ version: 30 }), { headers })
    );

    // Set the response of mocked partitions with additional fields.
    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/layers/test-layed-id/partitions?version=30&additionalFields=dataSize,checksum,compressedDataSize&billingTag=billing-tag`,
      new Response(JSON.stringify(mockedPartitions), { headers })
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

    const requestWithAdditionalFields = new PartitionsRequest()
      .withAdditionalFields(["dataSize", "checksum", "compressedDataSize"])
      .withFetchOption(FetchOptions.OnlineIfNotFound)
      .withBillingTag("billing-tag");

    const partitions = await layerClient.getPartitions(
      requestWithAdditionalFields
    );

    expect(partitions.partitions[0].checksum).to.be.equal(
      mockedPartitions.partitions[0].checksum
    );
    expect(partitions.partitions[1].compressedDataSize).to.be.equal(
      mockedPartitions.partitions[1].compressedDataSize
    );
    expect(partitions.partitions[1].dataSize).to.be.equal(
      mockedPartitions.partitions[1].dataSize
    );
  });

  it("Shoud read partitions with additionalFields parameter from QuadKeyPartitionsRequest", async function() {
    const mockedResponses = new Map();

    const mockedQuadKey = {
      row: 1,
      column: 2,
      level: 3
    };

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 30 }), { headers })
    );

    // Set the response from lookup api with the info about Query API.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
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
        ]),
        { headers }
      )
    );

    const mockedPartitions = {
      partitions: [
        {
          checksum: "291f66029c232400e3403cd6e9cfd36e",
          compressedDataSize: 1024,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
          dataSize: 1024,
          crc: "c3f276d7",
          partition: "314010583"
        },
        {
          checksum: "123f66029c232400e3403cd6e9cfd45b",
          compressedDataSize: 2084,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640578e",
          dataSize: 2084,
          crc: "c3f2766y",
          partition: "1000"
        }
      ],
      next: "/uri/to/next/page"
    };

    // Set the response of mocked partitions with additional fields.
    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/versions/30/quadkeys/70/depths/0?additionalFields=dataSize,checksum,compressedDataSize`,
      new Response(JSON.stringify(mockedPartitions), { headers })
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

    const quadKeyPartitionsRequestWithQuadKey = quadKeyPartitionsRequest.withQuadKey(
      mockedQuadKey
    );
    const quadKeyPartitionsRequestWithAdditionalFields = quadKeyPartitionsRequest.withAdditionalFields(
      ["dataSize", "checksum", "compressedDataSize"]
    );

    const partitions = await layerClient.getPartitions(
      quadKeyPartitionsRequestWithAdditionalFields
    );

    assert.isDefined(partitions);
  });

  it("Should user-agent be added to the each request", async function() {
    const mockedResponses = new Map();
    const mockedDataHandle = "1b2ca68f-d4a0-4379-8120-cd025640510c";
    const mockedData = Buffer.alloc(42);

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
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
          },
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
        ]),
        { headers }
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(mockedData, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      testHRN,
      testLayerId,
      settings
    );
    const request = new DataRequest().withDataHandle(mockedDataHandle);

    const data = await layerClient.getData(request);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(2); // 1 - lookup, 1 - blob
    const calls = fetchStub.getCalls();
    calls.forEach(call => {
      const callHeaders = call.args[1].headers;
      expect(callHeaders.get("User-Agent")).equals(`OLP-TS-SDK/${LIB_VERSION}`);
    });
  });

  it("GetAggregatedData", async function() {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("cache-control", "max-age=3600");

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "blob",
            version: "v1",
            baseURL:
              "https://blob.data.api.platform.here.com/hrn:here:data:::test-hrn/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          },
          {
            api: "query",
            version: "v1",
            baseURL:
              "https://query.data.api.platform.here.com/hrn:here:data:::test-hrn/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ]),
        { headers }
      )
    );

    mockedResponses.set(
      `https://query.data.api.platform.here.com/hrn:here:data:::test-hrn/v1/layers/mocked-layer/versions/123/quadkeys/24414/depths/4`,
      new Response(
        `{"subQuads":[{"subQuadKey":"64","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"65","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"66","version":309,"dataHandle":"2297193A99F513DA23F40D0021CB01D0.309"},{"subQuadKey":"67","version":309,"dataHandle":"D63FA9E9CD89638BCCCF729BB7AD1CB8.309"},{"subQuadKey":"68","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"69","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"70","version":309,"dataHandle":"2297193A99F513DA23F40D0021CB01D0.309"},{"subQuadKey":"71","version":309,"dataHandle":"D63FA9E9CD89638BCCCF729BB7AD1CB8.309"},{"subQuadKey":"72","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"73","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"74","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"75","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"76","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"77","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"78","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"79","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"80","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"81","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"82","version":309,"dataHandle":"2297193A99F513DA23F40D0021CB01D0.309"},{"subQuadKey":"83","version":309,"dataHandle":"D63FA9E9CD89638BCCCF729BB7AD1CB8.309"},{"subQuadKey":"84","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"85","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"86","version":309,"dataHandle":"2297193A99F513DA23F40D0021CB01D0.309"},{"subQuadKey":"87","version":309,"dataHandle":"D63FA9E9CD89638BCCCF729BB7AD1CB8.309"},{"subQuadKey":"88","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"89","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"90","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"91","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"92","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"93","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"94","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"95","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"96","version":309,"dataHandle":"91682A4ABCAC3AB95758CF1E01444373.309"},{"subQuadKey":"97","version":309,"dataHandle":"7D068B97290AC948DC84BEBF10DD2079.309"},{"subQuadKey":"98","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"99","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"100","version":309,"dataHandle":"91682A4ABCAC3AB95758CF1E01444373.309"},{"subQuadKey":"101","version":309,"dataHandle":"7D068B97290AC948DC84BEBF10DD2079.309"},{"subQuadKey":"102","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"103","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"104","version":309,"dataHandle":"3BC6E551388E7E9449A6376CB0DB9254.309"},{"subQuadKey":"105","version":309,"dataHandle":"235A730981B48E30E04CA20457E3AC05.309"},{"subQuadKey":"106","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"107","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"108","version":309,"dataHandle":"3BC6E551388E7E9449A6376CB0DB9254.309"},{"subQuadKey":"109","version":309,"dataHandle":"235A730981B48E30E04CA20457E3AC05.309"},{"subQuadKey":"110","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"111","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"112","version":309,"dataHandle":"91682A4ABCAC3AB95758CF1E01444373.309"},{"subQuadKey":"113","version":309,"dataHandle":"7D068B97290AC948DC84BEBF10DD2079.309"},{"subQuadKey":"114","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"115","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"116","version":309,"dataHandle":"91682A4ABCAC3AB95758CF1E01444373.309"},{"subQuadKey":"117","version":309,"dataHandle":"7D068B97290AC948DC84BEBF10DD2079.309"},{"subQuadKey":"118","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"119","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"120","version":309,"dataHandle":"3BC6E551388E7E9449A6376CB0DB9254.309"},{"subQuadKey":"121","version":309,"dataHandle":"235A730981B48E30E04CA20457E3AC05.309"},{"subQuadKey":"122","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"123","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"124","version":309,"dataHandle":"3BC6E551388E7E9449A6376CB0DB9254.309"},{"subQuadKey":"125","version":309,"dataHandle":"235A730981B48E30E04CA20457E3AC05.309"},{"subQuadKey":"126","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"127","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"1","version":309,"dataHandle":"9E835327487159C24CC3BD9ABC1D9D8D.309"},{"subQuadKey":"16","version":309,"dataHandle":"DE6CE7A31E7272C8037B3E5344769A1A.309"},{"subQuadKey":"17","version":309,"dataHandle":"DE6CE7A31E7272C8037B3E5344769A1A.309"},{"subQuadKey":"18","version":309,"dataHandle":"C9522D8AA448785FCBC3B05E763B5477.309"},{"subQuadKey":"19","version":309,"dataHandle":"C9522D8AA448785FCBC3B05E763B5477.309"},{"subQuadKey":"20","version":309,"dataHandle":"DE6CE7A31E7272C8037B3E5344769A1A.309"},{"subQuadKey":"21","version":309,"dataHandle":"DE6CE7A31E7272C8037B3E5344769A1A.309"},{"subQuadKey":"22","version":309,"dataHandle":"C9522D8AA448785FCBC3B05E763B5477.309"},{"subQuadKey":"23","version":309,"dataHandle":"C9522D8AA448785FCBC3B05E763B5477.309"},{"subQuadKey":"24","version":309,"dataHandle":"65435B35BBE9825D5A75F8CF77F8B683.309"},{"subQuadKey":"25","version":309,"dataHandle":"65435B35BBE9825D5A75F8CF77F8B683.309"},{"subQuadKey":"26","version":309,"dataHandle":"AA64D744612B79BDF0FB9B1D311F28FD.309"},{"subQuadKey":"27","version":309,"dataHandle":"AA64D744612B79BDF0FB9B1D311F28FD.309"},{"subQuadKey":"28","version":309,"dataHandle":"65435B35BBE9825D5A75F8CF77F8B683.309"},{"subQuadKey":"29","version":309,"dataHandle":"65435B35BBE9825D5A75F8CF77F8B683.309"},{"subQuadKey":"30","version":309,"dataHandle":"AA64D744612B79BDF0FB9B1D311F28FD.309"},{"subQuadKey":"31","version":309,"dataHandle":"AA64D744612B79BDF0FB9B1D311F28FD.309"},{"subQuadKey":"256","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"257","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"258","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"259","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"260","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"261","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"262","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"263","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"264","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"265","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"266","version":309,"dataHandle":"44B55F66BD0CC98BD2EEB22B0946B923.309"},{"subQuadKey":"267","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"268","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"269","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"270","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"271","version":309,"dataHandle":"BB918FD0A2C3D0C13486DC20E70FE5D1.309"},{"subQuadKey":"272","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"273","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"274","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"275","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"276","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"277","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"278","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"279","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"280","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"281","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"282","version":309,"dataHandle":"44B55F66BD0CC98BD2EEB22B0946B923.309"},{"subQuadKey":"283","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"284","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"285","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"286","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"287","version":309,"dataHandle":"BB918FD0A2C3D0C13486DC20E70FE5D1.309"},{"subQuadKey":"288","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"289","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"290","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"291","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"292","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"293","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"294","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"295","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"296","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"297","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"298","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"299","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"300","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"301","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"302","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"303","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"304","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"305","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"306","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"307","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"308","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"309","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"310","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"311","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"312","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"313","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"314","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"315","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"316","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"317","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"318","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"319","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"320","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"321","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"322","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"323","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"324","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"325","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"326","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"327","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"328","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"329","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"330","version":309,"dataHandle":"44B55F66BD0CC98BD2EEB22B0946B923.309"},{"subQuadKey":"331","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"332","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"333","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"334","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"335","version":309,"dataHandle":"BB918FD0A2C3D0C13486DC20E70FE5D1.309"},{"subQuadKey":"336","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"337","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"338","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"339","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"340","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"341","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"342","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"343","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"344","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"345","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"346","version":309,"dataHandle":"44B55F66BD0CC98BD2EEB22B0946B923.309"},{"subQuadKey":"347","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"348","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"349","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"350","version":309,"dataHandle":"436735897B05C80C449B1D654541DE5E.309"},{"subQuadKey":"351","version":309,"dataHandle":"BB918FD0A2C3D0C13486DC20E70FE5D1.309"},{"subQuadKey":"352","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"353","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"354","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"355","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"356","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"357","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"358","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"359","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"360","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"361","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"362","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"363","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"364","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"365","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"366","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"367","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"368","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"369","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"370","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"371","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"372","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"373","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"374","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"375","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"376","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"377","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"378","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"379","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"380","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"381","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"382","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"383","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"384","version":309,"dataHandle":"B0D537F52AC1C17A27A339824C3853F9.309"},{"subQuadKey":"385","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"386","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"387","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"388","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"389","version":309,"dataHandle":"A2FA393A124DDB2EEAF962D41F33E85F.309"},{"subQuadKey":"390","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"391","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"392","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"393","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"394","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"395","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"396","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"397","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"398","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"399","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"400","version":309,"dataHandle":"B0D537F52AC1C17A27A339824C3853F9.309"},{"subQuadKey":"401","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"402","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"403","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"404","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"405","version":309,"dataHandle":"A2FA393A124DDB2EEAF962D41F33E85F.309"},{"subQuadKey":"406","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"407","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"408","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"409","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"410","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"411","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"412","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"413","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"414","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"415","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"416","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"417","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"418","version":309,"dataHandle":"F357AFDE030AA20DF6960B48EB625CA3.309"},{"subQuadKey":"419","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"420","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"421","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"422","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"423","version":309,"dataHandle":"5F74311EA37E90F55EC09D98F93EDA0C.309"},{"subQuadKey":"424","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"425","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"426","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"427","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"428","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"429","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"430","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"431","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"432","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"433","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"434","version":309,"dataHandle":"F357AFDE030AA20DF6960B48EB625CA3.309"},{"subQuadKey":"435","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"436","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"437","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"438","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"439","version":309,"dataHandle":"5F74311EA37E90F55EC09D98F93EDA0C.309"},{"subQuadKey":"440","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"441","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"442","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"443","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"444","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"445","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"446","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"447","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"448","version":309,"dataHandle":"B0D537F52AC1C17A27A339824C3853F9.309"},{"subQuadKey":"449","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"450","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"451","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"452","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"453","version":309,"dataHandle":"A2FA393A124DDB2EEAF962D41F33E85F.309"},{"subQuadKey":"454","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"455","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"456","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"457","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"458","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"459","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"460","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"461","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"462","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"463","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"464","version":309,"dataHandle":"B0D537F52AC1C17A27A339824C3853F9.309"},{"subQuadKey":"465","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"466","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"467","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"468","version":309,"dataHandle":"8EE1A707C5CB22DA4AC554EA1CF954D7.309"},{"subQuadKey":"469","version":309,"dataHandle":"A2FA393A124DDB2EEAF962D41F33E85F.309"},{"subQuadKey":"470","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"471","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"472","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"473","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"474","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"475","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"476","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"477","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"478","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"479","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"480","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"481","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"482","version":309,"dataHandle":"F357AFDE030AA20DF6960B48EB625CA3.309"},{"subQuadKey":"483","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"484","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"485","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"486","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"487","version":309,"dataHandle":"5F74311EA37E90F55EC09D98F93EDA0C.309"},{"subQuadKey":"488","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"489","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"490","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"491","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"492","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"493","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"494","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"495","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"496","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"497","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"498","version":309,"dataHandle":"F357AFDE030AA20DF6960B48EB625CA3.309"},{"subQuadKey":"499","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"500","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"501","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"502","version":309,"dataHandle":"33FCF2B9A0A070C97A1372C355C56E9D.309"},{"subQuadKey":"503","version":309,"dataHandle":"5F74311EA37E90F55EC09D98F93EDA0C.309"},{"subQuadKey":"504","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"505","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"506","version":309,"dataHandle":"B8B9757AE8399D9603A684BAEA18C0AB.309"},{"subQuadKey":"507","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"508","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"509","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"510","version":309,"dataHandle":"5D220F614ED66FDD4850E9846482193A.309"},{"subQuadKey":"511","version":309,"dataHandle":"3774FD2C4E793770B86B82CF87F85E8B.309"},{"subQuadKey":"4","version":309,"dataHandle":"8941BA72534EA59DC78AA066874F3F46.309"},{"subQuadKey":"5","version":309,"dataHandle":"8941BA72534EA59DC78AA066874F3F46.309"},{"subQuadKey":"6","version":309,"dataHandle":"0357B7D8E5E267C27A40375EEFD8CBDF.309"},{"subQuadKey":"7","version":309,"dataHandle":"0357B7D8E5E267C27A40375EEFD8CBDF.309"}],"parentQuads":[{"partition":"1525","version":309,"dataHandle":"5FA96A639F78245CCA052E6CA1B2E356.309"},{"partition":"23","version":311,"dataHandle":"E49841168CC61793C19635AB788B19F0.311"},{"partition":"381","version":309,"dataHandle":"B5496E024A5BBDB0AE8A7BD38614BB81.309"},{"partition":"5","version":311,"dataHandle":"48FBFF69B74F5B5CEEAE0D410ACF3783.311"},{"partition":"6103","version":309,"dataHandle":"B003789C316D46D70BDB0B4D02AE654A.309"},{"partition":"95","version":309,"dataHandle":"A46A7D44C6DB3C2880A0076FAE4098AF.309"}]}`
      )
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/hrn:here:data:::test-hrn/v1/layers/mocked-layer/data/5D220F614ED66FDD4850E9846482193A.309`,
      new Response(Buffer.alloc(100))
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/hrn:here:data:::test-hrn/v1/layers/mocked-layer/data/436735897B05C80C449B1D654541DE5E.309`,
      new Response(Buffer.alloc(300))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });

    const layerClient = new VersionedLayerClient({
      catalogHrn: testHRN,
      layerId: "mocked-layer",
      settings,
      version: 123
    });

    const request = new TileRequest();

    const response = await layerClient.getAggregatedData(
      request.withTileKey({ row: 818, column: 2021, level: 11 })
    );
    const response2 = await layerClient.getAggregatedData(
      request.withTileKey({ row: 819, column: 2021, level: 11 })
    );

    assert.isDefined(response);
    assert.isDefined(response2);

    expect((await response.blob()).size).to.be.equals(100);
    expect((await response2.blob()).size).to.be.equals(300);

    /**
     * Should be 5 calls:
     * 1 - lookup
     * 2 - query
     * 3 - blob
     * 4 - blob
     */
    expect(fetchStub.callCount).to.be.equal(4);
  });
});
