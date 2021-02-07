/*
 * Copyright (C) 2020-2021 HERE Europe B.V.
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

import { CatalogClient } from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";
import { HRN, OlpClientSettings } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogClient", function() {
  class CatalogClientTest extends CatalogClient {
    constructor(catalogHrn: HRN, settings: OlpClientSettings) {
      super(catalogHrn, settings);
    }

    public async getCatalog(
      request: dataServiceRead.CatalogRequest,
      abortSignal?: AbortSignal
    ): Promise<dataServiceApi.ConfigApi.Catalog> {
      return {
        created: "test",
        description: "test",
        hrn: "test",
        id: "test",
        layers: [],
        name: "test",
        replication: {},
        summary: "test",
        tags: [],
        version: 1
      };
    }

    public async getEarliestVersion(
      request: dataServiceRead.CatalogVersionRequest,
      abortSignal?: AbortSignal
    ): Promise<number> {
      return Promise.resolve(1);
    }

    public async getLayerVersions(
      request: dataServiceRead.LayerVersionsRequest,
      abortSignal?: AbortSignal
    ): Promise<dataServiceApi.MetadataApi.LayerVersion[]> {
      return Promise.resolve([
        {
          layer: "test",
          version: 1,
          timestamp: 1
        }
      ]);
    }

    public async getLatestVersion(
      request: dataServiceRead.CatalogVersionRequest,
      abortSignal?: AbortSignal
    ): Promise<number> {
      return Promise.resolve(1);
    }
  }

  let sandbox: sinon.SinonSandbox;
  const mockedHRN = HRN.fromString("hrn:here:data:::live-weather-na");

  sandbox = sinon.createSandbox();
  let settings = new OlpClientSettings({
    environment: "here",
    getToken: () => Promise.resolve("mocked-token")
  });

  it("Shoud be initialized with arguments", async function() {
    const catalogClient = new CatalogClient(mockedHRN, settings);
    assert.isDefined(catalogClient);

    expect(catalogClient).to.be.instanceOf(CatalogClient);
    assert.isDefined(catalogClient.getCatalog);
    assert.isDefined(catalogClient.getEarliestVersion);
    assert.isDefined(catalogClient.getLatestVersion);
    assert.isDefined(catalogClient.getLayerVersions);
  });

  it("Test getCatalog method with request", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);

    const response = await catalogClient.getCatalog(
      new dataServiceRead.CatalogRequest()
    );
    assert.isDefined(response);
  });

  it("Test getCatalog method with catalogRequest and abortSignal", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);
    const abortSignal: any = "test";

    const response = await catalogClient.getCatalog(
      new dataServiceRead.CatalogRequest(),
      abortSignal
    );
    assert.isDefined(response);
  });

  it("Test getEarliestVersion method with catalogVersionRequest", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);

    const response = await catalogClient.getEarliestVersion(
      new dataServiceRead.CatalogVersionRequest()
    );
    assert.isDefined(response);
  });

  it("Test getEarliestVersion method with catalogVersionRequest and abortSignal", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);
    const abortSignal: any = "test";

    const response = await catalogClient.getEarliestVersion(
      new dataServiceRead.CatalogVersionRequest(),
      abortSignal
    );
    assert.isDefined(response);
  });

  it("Test getLatestVersion method with catalogVersionRequest", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);

    const response = await catalogClient.getLatestVersion(
      new dataServiceRead.CatalogVersionRequest()
    );
    assert.isDefined(response);
  });

  it("Test getLatestVersion method with catalogVersionRequest and abortSignal", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);
    const abortSignal: any = "test";

    const response = await catalogClient.getLatestVersion(
      new dataServiceRead.CatalogVersionRequest(),
      abortSignal
    );
    assert.isDefined(response);
  });

  it("Test getLayerVersions method with layerVersionsRequest", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);

    const response = await catalogClient.getLayerVersions(
      new dataServiceRead.LayerVersionsRequest()
    );
    assert.isDefined(response);
  });

  it("Test getLayerVersions method with layerVersionsRequest and abortSignal", async function() {
    const catalogClient = new CatalogClientTest(mockedHRN, settings);
    const abortSignal: any = "test";

    const response = await catalogClient.getLayerVersions(
      new dataServiceRead.LayerVersionsRequest(),
      abortSignal
    );
    assert.isDefined(response);
  });
});
