/*
 * Copyright (C) 2020 HERE Europe B.V.
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
  ArtifactClient,
  SchemaRequest,
  SchemaDetailsRequest,
  HRN
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "../FetchMock";
import { LIB_VERSION } from "@here/olp-sdk-dataservice-read/lib.version";
import { HttpError } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ArtifactClient", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let artifactClient: ArtifactClient;
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

    // Setup Artifact Client with new OlpClientSettings.
    settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    artifactClient = new ArtifactClient(settings);
  });

  it("Shoud be initialized with settings", async () => {
    assert.isDefined(artifactClient);
    expect(artifactClient).to.be.instanceOf(ArtifactClient);
  });

  it("Should fetch the schema details", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("cache-control", "max-age=3600");

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/platform/apis`,
      new Response(
        JSON.stringify([
          {
            api: "artifact",
            version: "v1",
            baseURL: "https://artifact.data.api.platform.here.com/artifact/v1",
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

    const mockedResponse = {
      artifacts: [
        {
          artifactId: "test_v1",
          created: {},
          groupId: "com.here.rib.schema",
          hrn: "hrn:here:artifact::realm:com.here.test.mock:test_v1",
          updated: {},
          version: "1.0.0"
        }
      ],
      schema: {
        artifactId: "topology-geometry_v1",
        created: "2020-01-02T12:28:06.578Z",
        groupId: "com.here.rib.schema",
        hrn: "hrn:here:artifact::realm:com.here.test.mock:test_v1",
        name: "test_v1",
        summary: "The schema for road topology.",
        updated: "2020-01-02T12:28:06.578Z",
        version: "1.0.0"
      },
      schemaValidationResults: [
        {
          backwardsCompatibility: true,
          fileExtension: true,
          googleStyle: true,
          majorVersionInPackage: true,
          module: "string",
          packageConsistency: true
        }
      ],
      variants: [
        {
          id: "doc",
          url: "artifact/hrn:here:artifact:::com.here.schema.fake:100500-v1"
        },
        {
          id: "doc",
          url: "artifact/hrn:here:artifact:::com.here.schema.fake:100500-v2"
        }
      ]
    };

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://artifact.data.api.platform.here.com/artifact/v1/schema/hrn:here:schema:::com.here.schema.mock:test_v2:2.38.0`,
      new Response(JSON.stringify(mockedResponse), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new SchemaDetailsRequest().withSchema(
      HRN.fromString("hrn:here:schema:::com.here.schema.mock:test_v2:2.38.0")
    );

    const response = await artifactClient.getSchemaDetails(request);

    assert.isDefined(response);
    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should getSchemaDetails() handle errors", async () => {
    const request = new SchemaDetailsRequest().withBillingTag("billing-tag");

    const response = await artifactClient
      .getSchemaDetails(request)
      .catch(error => {
        expect(error.message).equal(
          "Please provide the schema HRN by schemaDetailsRequest.withSchema()"
        );
      });
  });

  it("Should getSchema() handle errors", async () => {
    const request = new SchemaRequest();

    const response = await artifactClient.getSchema(request).catch(error => {
      expect(error.message).equal(
        "Please provide the schema variant by schemaRequest.withVariant()"
      );
    });
  });

  it("Should fetch file of the schema", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("cache-control", "max-age=3600");

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/platform/apis`,
      new Response(
        JSON.stringify([
          {
            api: "artifact",
            version: "v1",
            baseURL: "https://artifact.data.api.platform.here.com/artifact/v1",
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

    const mockedResponse = Buffer.alloc(42);
    const mockedResponse2 = Buffer.alloc(50);

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://artifact.data.api.platform.here.com/artifact/v1/artifact/hrn:here:artifact:::com.here.schema.fake:100500-v2`,
      new Response(mockedResponse, { headers })
    );

    mockedResponses.set(
      `https://artifact.data.api.platform.here.com/artifact/v1/artifact/hrn:here:artifact:::com.here.schema.fake:100702-v2`,
      new Response(mockedResponse2, { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new SchemaRequest().withVariant({
      id: "doc",
      url: "artifact/hrn:here:artifact:::com.here.schema.fake:100500-v2"
    });

    const request2 = new SchemaRequest().withVariant({
      id: "doc",
      url: "artifact/hrn:here:artifact:::com.here.schema.fake:100702-v2"
    });

    const response = await artifactClient.getSchema(request);

    const response2 = await artifactClient.getSchema(request2);

    assert.isDefined(response);
    expect(response.byteLength).to.be.equal(42);
    assert.isDefined(response2);
    expect(response2.byteLength).to.be.equal(50);
    expect(fetchStub.callCount).to.be.equal(3);
  });

  it("Should getSchema() handle 400 error", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("cache-control", "max-age=3600");

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/platform/apis`,
      new Response(
        JSON.stringify([
          {
            api: "artifact",
            version: "v1",
            baseURL: "https://artifact.data.api.platform.here.com/artifact/v1",
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

    const mockedResponse = Buffer.alloc(42);

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://artifact.data.api.platform.here.com/artifact/v1/artifact/hrn:here:artifact:::com.here.schema.fake:100500-v2`,
      new HttpError(500, "Internal server error")
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new SchemaRequest()
      .withVariant({
        id: "doc",
        url: "artifact/hrn:here:artifact:::com.here.schema.fake:100500-v2"
      })
      .withBillingTag("billing-tag");

    const response = await artifactClient.getSchema(request).catch(error => {
      expect(error.message).equal(
        "Artifact Service error: HTTP 500: Internal server error"
      );
    });
  });

  it("Should user-agent be added to the each request", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("cache-control", "max-age=3600");

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/platform/apis`,
      new Response(
        JSON.stringify([
          {
            api: "artifact",
            version: "v1",
            baseURL: "https://artifact.data.api.platform.here.com/artifact/v1",
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

    const mockedResponse = {
      artifacts: [
        {
          artifactId: "test_v1",
          created: {},
          groupId: "com.here.rib.schema",
          hrn: "hrn:here:artifact::realm:com.here.test.mock:test_v1",
          updated: {},
          version: "1.0.0"
        }
      ],
      schema: {
        artifactId: "topology-geometry_v1",
        created: "2020-01-02T12:28:06.578Z",
        groupId: "com.here.rib.schema",
        hrn: "hrn:here:artifact::realm:com.here.test.mock:test_v1",
        name: "test_v1",
        summary: "The schema for road topology.",
        updated: "2020-01-02T12:28:06.578Z",
        version: "1.0.0"
      },
      schemaValidationResults: [
        {
          backwardsCompatibility: true,
          fileExtension: true,
          googleStyle: true,
          majorVersionInPackage: true,
          module: "string",
          packageConsistency: true
        }
      ],
      variants: [
        {
          id: "doc",
          url: "artifact/hrn:here:artifact:::com.here.schema.fake:100500-v1"
        },
        {
          id: "doc",
          url: "artifact/hrn:here:artifact:::com.here.schema.fake:100500-v2"
        }
      ]
    };

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://artifact.data.api.platform.here.com/artifact/v1/schema/hrn:here:schema:::com.here.schema.mock:test_v2:2.38.0`,
      new Response(JSON.stringify(mockedResponse), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new SchemaDetailsRequest().withSchema(
      HRN.fromString("hrn:here:schema:::com.here.schema.mock:test_v2:2.38.0")
    );

    const response = await artifactClient.getSchemaDetails(request);

    assert.isDefined(response);
    expect(fetchStub.callCount).to.be.equal(2);
    const calls = fetchStub.getCalls();
    calls.forEach(call => {
      const callHeaders = call.args[1].headers;
      expect(callHeaders.get("User-Agent")).equals(`OLP-TS-SDK/${LIB_VERSION}`);
    });
  });
});
