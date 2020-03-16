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
  ConfigClient,
  SchemaRequest,
  SchemaDetailsRequest,
  HRN,
  CatalogsRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";
import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import { LIB_VERSION } from "@here/olp-sdk-dataservice-read/lib.version";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("configClient", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let configClient: ConfigClient;
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

    // Setup Config Client with new OlpClientSettings.
    settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    configClient = new ConfigClient(settings);
  });

  it("Shoud be initialized with settings", async () => {
    assert.isDefined(configClient);
    expect(configClient).to.be.instanceOf(ConfigClient);
  });

  it("Should fetch the list of catalogs to which you have access", async () => {
    const mockedResponses = new Map();

    const mockedCatalogsHRN: ConfigApi.CatalogsListResult = {
      results: {
        items: [
          { hrn: "hrn:::test-hrn" },
          { hrn: "hrn:::test-hrn2" },
          { hrn: "hrn:::test-hrn3" }
        ]
      }
    };

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
        ])
      )
    );

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://config.data.api.platform.here.com/config/v1/catalogs`,
      new Response(JSON.stringify(mockedCatalogsHRN))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogsRequest();

    const response = await configClient.getCatalogs(request);

    assert.isDefined(response);
    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should fetch the list of catalogs to which you have access filtered by hrn", async () => {
    const mockedResponses = new Map();

    const mockedCatalogsFilteredByHRN: ConfigApi.CatalogsListResult = {
      results: { items: [{ hrn: "hrn:::test-hrn" }] }
    };
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
        ])
      )
    );

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://config.data.api.platform.here.com/config/v1/catalogs?verbose=true&schemaHrn=hrn%3A%3A%3Atest-hrn`,
      new Response(JSON.stringify(mockedCatalogsFilteredByHRN))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogsRequest().withSchema("hrn:::test-hrn");

    const response = await configClient.getCatalogs(request);

    assert.isDefined(response);
    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should user-agent be added to the each request", async () => {
    const mockedResponses = new Map();

    const mockedCatalogsHRN: ConfigApi.CatalogsListResult = {
      results: {
        items: [
          { hrn: "hrn:::test-hrn" },
          { hrn: "hrn:::test-hrn2" },
          { hrn: "hrn:::test-hrn3" }
        ]
      }
    };

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
        ])
      )
    );

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://config.data.api.platform.here.com/config/v1/catalogs`,
      new Response(JSON.stringify(mockedCatalogsHRN))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogsRequest();

    const response = await configClient.getCatalogs(request);

    assert.isDefined(response);
    expect(fetchStub.callCount).to.be.equal(2);
    const calls = fetchStub.getCalls();
    calls.forEach(call => {
      const callHeaders = call.args[1].headers;
      expect(callHeaders.get("User-Agent")).equals(`OLP-TS-SDK/${LIB_VERSION}`);
    });
  });
});
