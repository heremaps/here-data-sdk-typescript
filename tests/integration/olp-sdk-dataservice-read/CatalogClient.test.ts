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

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import {
  CatalogVersionRequest,
  CatalogClient,
  CatalogRequest,
  LayerVersionsRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "../FetchMock";
import * as core from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogClient", function() {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let catalogClient: CatalogClient;
  let settings: core.OlpClientSettings;
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

    // Setup Catalog Client with new OlpClientSettings.
    settings = new core.OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    catalogClient = new CatalogClient(
      core.HRN.fromString("hrn:here:data:::test-hrn"),
      settings
    );
  });

  it("Shoud be initialized with settings", async function() {
    assert.isDefined(catalogClient);
    expect(catalogClient).to.be.instanceOf(CatalogClient);
  });

  it("Should fetch the information about about specific catalog versions", async function() {
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

    const mockedVersions = {
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
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 2
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 3
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 4
        }
      ]
    };

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions?startVersion=2&endVersion=4`,
      new Response(JSON.stringify(mockedVersions), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogVersionRequest()
      .withStartVersion(2)
      .withEndVersion(4);

    let versionsResponse = await catalogClient.getVersions(request);

    assert.isDefined(versionsResponse);

    expect(versionsResponse.versions[0].version).to.be.equal(2);
    expect(versionsResponse.versions[1].version).to.be.equal(3);
    expect(versionsResponse.versions[2].version).to.be.equal(4);

    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should fetch the information about all catalog versions", async function() {
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

    const mockedVersions = {
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
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 1
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 2
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 3
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 4
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 50
        }
      ]
    };

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify(mockedVersions), { headers })
    );

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions?startVersion=-1`,
      new Response(JSON.stringify(mockedVersions), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogVersionRequest();

    let versionsResponse = await catalogClient.getVersions(request);

    assert.isDefined(versionsResponse);

    expect(versionsResponse.versions[0].version).to.be.equal(1);
    expect(versionsResponse.versions[1].version).to.be.equal(2);
    expect(versionsResponse.versions[2].version).to.be.equal(3);
    expect(versionsResponse.versions[3].version).to.be.equal(4);
    expect(versionsResponse.versions[4].version).to.be.equal(50);

    expect(fetchStub.callCount).to.be.equal(3);
  });

  it("Should fetch the configuration of all catalogs", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/platform/apis`,
      new Response(
        JSON.stringify([
          {
            api: "config",
            version: "v1",
            baseURL: "https://config.data.api.platform.here.com/config/v1",
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

    const mockedCatalogs = {
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
          hrn: "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
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

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://config.data.api.platform.here.com/config/v1/catalogs/hrn:here:data:::test-hrn`,
      new Response(JSON.stringify(mockedCatalogs), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogRequest();

    let response = await catalogClient.getCatalog(request);

    assert.isDefined(response);

    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should read the full catalog configuration for the requested catalog", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/platform/apis`,
      new Response(
        JSON.stringify([
          {
            api: "config",
            version: "v1",
            baseURL: "https://config.data.api.platform.here.com/config/v1",
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

    const mockedCatalog = {
      id: "here-internal-test",
      hrn: "hrn:here-dev:data:::here-internal-test",
      name: "here-internal-test",
      summary: "Internal test for here",
      description: "Catalog Description",
      tags: [],
      created: "2018-07-13T20:50:08.425Z",
      replication: {},
      layers: [
        {
          id: "mocked-layed-id",
          hrn: "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
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

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://config.data.api.platform.here.com/config/v1/catalogs/hrn:here:data:::test-hrn?billingTag=billingTag`,
      new Response(JSON.stringify(mockedCatalog), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const catalogRequest = new CatalogRequest().withBillingTag("billingTag");
    let catalogConfig = await catalogClient.getCatalog(catalogRequest);

    assert.isDefined(catalogConfig);
    expect(catalogConfig.id).to.be.equal("here-internal-test");
    expect(catalogConfig.hrn).to.be.equal(
      "hrn:here-dev:data:::here-internal-test"
    );
    expect(catalogConfig.name).to.be.equal("here-internal-test");
    expect(catalogConfig.summary).to.be.equal("Internal test for here");
    expect(catalogConfig.description).to.be.equal("Catalog Description");
    expect(catalogConfig.created).to.be.equal("2018-07-13T20:50:08.425Z");
    expect(catalogConfig.version).to.be.equal(3);
    expect(catalogConfig.layers[0].id).to.be.equal("mocked-layed-id");
    expect(catalogConfig.layers[0].hrn).to.be.equal(
      "hrn:here-dev:data:::here-internal-test:hype-test-prefetch"
    );
    expect(catalogConfig.layers[0].layerType).to.be.equal("versioned");
    assert.isDefined(catalogConfig.tags);
    assert.isDefined(catalogConfig.replication);

    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should getEarliestVersion() return version", async function() {
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

    mockedResponses.set(
      "https://metadata.data.api.platform.here.com/metadata/v1/versions/minimum",
      new Response(JSON.stringify({ version: 42 }))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogVersionRequest();

    let version = await catalogClient.getEarliestVersion(request);

    assert.isDefined(version);
    expect(version).to.be.equal(42);
  });

  it("Should getLayerVersions() with latest version return layer version", async function() {
    const mockedResponses = new Map();
    const mockedResponse = {
      version: 42,
      layerVersions: [1, 2, 3]
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

    mockedResponses.set(
      "https://metadata.data.api.platform.here.com/metadata/v1/layerVersions?version=42",
      new Response(JSON.stringify(mockedResponse))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new LayerVersionsRequest().withVersion(42);

    let versions = await catalogClient.getLayerVersions(request);

    assert.isDefined(versions);
    expect(versions.length).to.be.equal(mockedResponse.layerVersions.length);
  });

  it("Should getLayerVersions() without latest version return layer version", async function() {
    const mockedResponses = new Map();
    const mockedResponse = {
      version: 42,
      layerVersions: [1, 2, 3]
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

    mockedResponses.set(
      "https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1&billingTag=billingTag",
      new Response(JSON.stringify({ version: 42 }))
    );

    mockedResponses.set(
      "https://metadata.data.api.platform.here.com/metadata/v1/layerVersions?version=42&billingTag=billingTag",
      new Response(JSON.stringify(mockedResponse))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new LayerVersionsRequest().withBillingTag("billingTag");

    let versions = await catalogClient.getLayerVersions(request);

    assert.isDefined(versions);
    expect(versions.length).to.be.equal(mockedResponse.layerVersions.length);
  });
});
