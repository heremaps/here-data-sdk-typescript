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
  OlpClientSettings,
  HRN,
  PartitionsRequest,
  VersionedLayerClient,
  QuadKeyPartitionsRequest,
  quadKeyFromMortonCode,
  DataRequest,
  CatalogClient,
  LayerVersionsRequest,
  CatalogVersionRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";

chai.use(sinonChai);
const expect = chai.expect;

describe("Handling versions in the requests classes and clients", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let settings: OlpClientSettings;

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

    // Setup Catalog Client with new OlpClientSettings.
    settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
  });

  it("Should use version 0 for getPartitions with PartitionsRequest.withVersion(0).withPartitionIds(['23605706']);", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      partitions: [
        {
          checksum: "291f66029c232400e3403cd6e9cfd36e",
          compressedDataSize: 1024,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
          dataSize: 1024,
          crc: "c3f276d7",
          partition: "23605706"
        }
      ],
      next: "/uri/to/next/page"
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new PartitionsRequest()
      .withVersion(0)
      .withPartitionIds(["23605706"]);

    await client.getPartitions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(2); // First to lookup api, second to the Query API.
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0"
    );
  });

  it("Should use version 0 for getPartitions with QuadKeyPartitionsRequest.withVersion(0).withQuadKey(quadKeyFromMortonCode(23605706));", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      parentQuads: [
        {
          additionalMetadata: "string",
          checksum: "string",
          compressedDataSize: 0,
          dataHandle: "675911FF6236B7C7604BF8B105F1BB58",
          dataSize: 0,
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
          subQuadKey: "string",
          version: 1
        }
      ]
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new QuadKeyPartitionsRequest()
      .withVersion(0)
      .withQuadKey(quadKeyFromMortonCode(23605706));

    await client.getPartitions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(2); // First to lookup api, second to the Query API.
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0"
    );
  });

  it("Should use version 0 for getData with DataRequest.withVersion(0).withQuadKey(quadKeyFromMortonCode(23605706));", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      parentQuads: [
        {
          additionalMetadata: "string",
          checksum: "string",
          compressedDataSize: 0,
          dataHandle: "675911FF6236B7C7604BF8B105F1BB58",
          dataSize: 0,
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
          subQuadKey: "string",
          version: 1
        }
      ]
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/topology-geometry/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(Buffer.alloc(42))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new DataRequest()
      .withVersion(0)
      .withQuadKey(quadKeyFromMortonCode(23605706));

    await client.getData(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(3); // 1 - lookup api, 1 - the Query API, 1 - blob API
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0"
    );
  });

  it("Should use version 0 for getData with DataRequest.withVersion(0).withPartitionId('23605706');", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      partitions: [
        {
          checksum: "291f66029c232400e3403cd6e9cfd36e",
          compressedDataSize: 1024,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
          dataSize: 1024,
          crc: "c3f276d7",
          partition: "23605706"
        }
      ],
      next: "/uri/to/next/page"
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/topology-geometry/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(Buffer.alloc(42))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new DataRequest().withVersion(0).withPartitionId("23605706");

    await client.getData(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(3); // 1 - lookup api, 1 - the Query API, 1 - blob API
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0"
    );
  });

  it("Should use locked version 142 for getPartitions with PartitionsRequest.withPartitionIds(['23605706']);", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      partitions: [
        {
          checksum: "291f66029c232400e3403cd6e9cfd36e",
          compressedDataSize: 1024,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
          dataSize: 1024,
          crc: "c3f276d7",
          partition: "23605706"
        }
      ],
      next: "/uri/to/next/page"
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=142`,
      new Response(JSON.stringify(mockedPartitions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new PartitionsRequest().withPartitionIds(["23605706"]);

    await client.getPartitions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(2); // First to lookup api, second to the Query API.
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=142"
    );
  });

  it("Should use locked version 142 for getPartitions with QuadKeyPartitionsRequest.withQuadKey(quadKeyFromMortonCode(23605706));", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      parentQuads: [
        {
          additionalMetadata: "string",
          checksum: "string",
          compressedDataSize: 0,
          dataHandle: "675911FF6236B7C7604BF8B105F1BB58",
          dataSize: 0,
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
          subQuadKey: "string",
          version: 1
        }
      ]
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/142/quadkeys/23605706/depths/0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new QuadKeyPartitionsRequest().withQuadKey(
      quadKeyFromMortonCode(23605706)
    );

    await client.getPartitions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(2); // First to lookup api, second to the Query API.
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/142/quadkeys/23605706/depths/0"
    );
  });

  it("Should use locked version 142 for getData with DataRequest.withQuadKey(quadKeyFromMortonCode(23605706));", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      parentQuads: [
        {
          additionalMetadata: "string",
          checksum: "string",
          compressedDataSize: 0,
          dataHandle: "675911FF6236B7C7604BF8B105F1BB58",
          dataSize: 0,
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
          subQuadKey: "string",
          version: 1
        }
      ]
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/142/quadkeys/23605706/depths/0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/topology-geometry/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(Buffer.alloc(42))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new DataRequest().withQuadKey(quadKeyFromMortonCode(23605706));

    await client.getData(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(3); // 1 - lookup api, 1 - the Query API, 1 - blob API
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/142/quadkeys/23605706/depths/0"
    );
  });

  it("Should use locked version 142 for getData with DataRequest.withPartitionId('23605706');", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      partitions: [
        {
          checksum: "291f66029c232400e3403cd6e9cfd36e",
          compressedDataSize: 1024,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
          dataSize: 1024,
          crc: "c3f276d7",
          partition: "23605706"
        }
      ],
      next: "/uri/to/next/page"
    };

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=142`,
      new Response(JSON.stringify(mockedPartitions))
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/topology-geometry/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(Buffer.alloc(42))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      version: 142,
      settings
    });

    const rq = new DataRequest().withPartitionId("23605706");

    await client.getData(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[1];

    expect(callsToApi.length).equals(3); // 1 - lookup api, 1 - the Query API, 1 - blob API
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=142"
    );
  });

  it("Should use latest version for getPartitions with PartitionsRequest.withPartitionIds(['23605706']) and lock it;", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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
        ])
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
          partition: "23605706"
        }
      ],
      next: "/uri/to/next/page"
    };

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 0 }))
    );

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      settings
    });

    const rq = new PartitionsRequest().withPartitionIds(["23605706"]);

    await client.getPartitions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[2];

    expect(callsToApi.length).equals(3); // 1 - lookup api, 1 - Metadata API, 1 - Query API.

    expect(client["version"]).equals(0);
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0"
    );
  });

  it("Should use latest version for getPartitions with QuadKeyPartitionsRequest.withQuadKey(quadKeyFromMortonCode(23605706)) and lock it;", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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
        ])
      )
    );

    const mockedPartitions = {
      parentQuads: [
        {
          additionalMetadata: "string",
          checksum: "string",
          compressedDataSize: 0,
          dataHandle: "675911FF6236B7C7604BF8B105F1BB58",
          dataSize: 0,
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
          subQuadKey: "string",
          version: 1
        }
      ]
    };

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 0 }))
    );

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      settings
    });

    const rq = new QuadKeyPartitionsRequest().withQuadKey(
      quadKeyFromMortonCode(23605706)
    );

    await client.getPartitions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[2];

    expect(callsToApi.length).equals(3); // 1 - lookup API, 1 - Metadata API, 1 - Query API.

    expect(client["version"]).equals(0);
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0"
    );
  });

  it("Should use latest version for getData with DataRequest.withQuadKey(quadKeyFromMortonCode(23605706)) and lock it;", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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
        ])
      )
    );

    const mockedPartitions = {
      parentQuads: [
        {
          additionalMetadata: "string",
          checksum: "string",
          compressedDataSize: 0,
          dataHandle: "675911FF6236B7C7604BF8B105F1BB58",
          dataSize: 0,
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
          subQuadKey: "string",
          version: 1
        }
      ]
    };

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 0 }))
    );

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/topology-geometry/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(Buffer.alloc(42))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      settings
    });

    const rq = new DataRequest().withQuadKey(quadKeyFromMortonCode(23605706));

    await client.getData(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[2];

    expect(callsToApi.length).equals(4); // 1 - lookup api, 1 - Metadata API, 1 - the Query API, 1 - blob API

    expect(client["version"]).equals(0);
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/versions/0/quadkeys/23605706/depths/0"
    );
  });

  it("Should use latest version for getData with DataRequest.withPartitionId('23605706') and lock it;", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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
        ])
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
          partition: "23605706"
        }
      ],
      next: "/uri/to/next/page"
    };

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify({ version: 0 }))
    );

    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0`,
      new Response(JSON.stringify(mockedPartitions))
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/topology-geometry/data/1b2ca68f-d4a0-4379-8120-cd025640510c`,
      new Response(Buffer.alloc(42))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data::olp-here:rib-2"),
      layerId: "topology-geometry",
      settings
    });

    const rq = new DataRequest().withPartitionId("23605706");

    await client.getData(rq);

    const callsToApi = fetchStub.getCalls();
    const callToQueryApi = callsToApi[2];

    expect(callsToApi.length).equals(4); // 1 - lookup api, 1 - Metadata API, 1 - the Query API, 1 - blob API

    expect(client["version"]).equals(0);
    expect(callToQueryApi.args[0]).equals(
      "https://query.data.api.platform.here.com/query/v1/layers/topology-geometry/partitions?partition=23605706&version=0"
    );
  });

  it("Should use version 0 for getLayerVersions with LayerVersionsRequest.withVersion(0);", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/layerVersions?version=0`,
      new Response(
        JSON.stringify({
          layerVersions: [
            {
              layer: "my-layer",
              version: 0,
              timestamp: "1516397474657"
            }
          ],
          version: 1
        })
      )
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new CatalogClient(
      HRN.fromString("hrn:here:data::olp-here:rib-2"),
      settings
    );

    const rq = new LayerVersionsRequest().withVersion(0);

    await client.getLayerVersions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToMetadataApi = callsToApi[1];

    expect(callsToApi.length).equals(2); // 1 - lookup api, 1 - Metadata API

    expect(callToMetadataApi.args[0]).equals(
      "https://metadata.data.api.platform.here.com/metadata/v1/layerVersions?version=0"
    );
  });

  it("Should use version 0 for getVersions with CatalogVersionRequest.withEndVersion(0);", async () => {
    const mockedResponses = new Map();

    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions?startVersion=-1&endVersion=0`,
      new Response(
        JSON.stringify({
          versions: [
            {
              dependencies: [
                {
                  direct: false,
                  hrn: "hrn:here:data:::my-catalog",
                  version: 23
                }
              ],
              partitionCounts: {
                property1: 0,
                property2: 0
              },
              timestamp: "1516397474657",
              version: 1
            }
          ]
        })
      )
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new CatalogClient(
      HRN.fromString("hrn:here:data::olp-here:rib-2"),
      settings
    );

    const rq = new CatalogVersionRequest().withEndVersion(0);

    await client.getVersions(rq);

    const callsToApi = fetchStub.getCalls();
    const callToMetadataApi = callsToApi[1];

    expect(callsToApi.length).equals(2); // 1 - lookup api, 1 - Metadata API

    expect(callToMetadataApi.args[0]).equals(
      "https://metadata.data.api.platform.here.com/metadata/v1/versions?startVersion=-1&endVersion=0"
    );
  });
});
