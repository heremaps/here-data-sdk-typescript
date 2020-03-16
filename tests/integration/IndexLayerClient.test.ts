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
  OlpClientSettings,
  HRN,
  IndexLayerClient,
  IndexQueryRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";
import { Buffer } from "buffer";
import { LIB_VERSION } from "@here/olp-sdk-dataservice-read/lib.version";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("IndexLayerClient", () => {
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

  it("Shoud be initialized with settings", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const indexClient = new IndexLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );
    assert.isDefined(indexClient);
    expect(indexClient).to.be.instanceOf(IndexLayerClient);
  });

  it("Shoud be fetched partitions all metadata", async () => {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Index service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "index",
            version: "v1",
            baseURL: "https://index.data.api.platform.here.com/index/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ])
      )
    );

    // Set the response of mocked partitions from index service.
    mockedResponses.set(
      `https://index.data.api.platform.here.com/index/v1/layers/test-layed-id?huge=false&query=hour_from%3E0`,
      new Response(
        JSON.stringify({
          data: [
            {
              id: "8c0e5ac9-b036-4365-8820-dfcba64588fc",
              size: 111928,
              checksum: "448a33cd65c47bed1eeb4d72e7fa022c95a41158",
              timestamp: 1551981674191,
              hour_from: 1506402000000,
              tile_id: 377894442,
              crc: null
            },
            {
              id: "a2ee29d9-4812-4322-b028-bded0bd2b92f",
              size: 397246,
              checksum: "cb2666fb46ba98788b88c905a766f5675366ef7f",
              timestamp: 1551981674191,
              hour_from: 1506402000000,
              tile_id: 377894440,
              crc: null
            },
            {
              id: "a439ca8d-a3b5-4fdc-8513-4e3697c4fbc7",
              size: 364671,
              checksum: "0c12b693835a86c02a0b0028cea24d12371acdce",
              timestamp: 1551981674191,
              hour_from: 1506402000000,
              tile_id: 377894444,
              crc: null
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
    const indexClient = new IndexLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );

    // Setup IndexQueryRequest with query parameter
    const request = new IndexQueryRequest().withQueryString("hour_from>0");

    // Send request for partitions metadata.
    const data = await indexClient.getPartitions(request).catch(error => {
      console.log(`Error getting partitions: ${error}`);
    });

    // Check if partitions fetched succesful.
    assert.isDefined(data);

    if (data) {
      // Check if partitions returns as expected.
      expect(data[0].id).to.be.equal("8c0e5ac9-b036-4365-8820-dfcba64588fc");
      expect(data[1].checksum).to.be.equal(
        "cb2666fb46ba98788b88c905a766f5675366ef7f"
      );
      expect(data.length).to.be.equal(3);
    }
    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Shoud be fetched data with dataHandle", async () => {
    const mockedResponses = new Map();
    const mockedData = Buffer.alloc(42);
    const mockedModel = {
      id: "8c0e5ac9-b036-4365-8820-dfcba64588fc",
      size: 111928,
      checksum: "448a33cd65c47bed1eeb4d72e7fa022c95a41158",
      timestamp: 1551981674191,
      hour_from: 1506402000000,
      tile_id: 377894442,
      crc: null
    };

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
          }
        ])
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/8c0e5ac9-b036-4365-8820-dfcba64588fc`,
      new Response(mockedData)
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const indexClient = new IndexLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );

    const data = await indexClient.getData(mockedModel);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Shoud be initialized with IndexLayerClientParams", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });

    const indexLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    };
    const indexLayerClient = new IndexLayerClient(indexLayerClientParams);

    assert.isDefined(indexLayerClient);
    expect(indexLayerClient).to.be.instanceOf(IndexLayerClient);
    assert.equal(indexLayerClient["hrn"], "hrn:here:data:::test-hrn");
  });

  it("Should user-agent be added to the each request", async () => {
    const mockedResponses = new Map();
    const mockedData = Buffer.alloc(42);
    const mockedModel = {
      id: "8c0e5ac9-b036-4365-8820-dfcba64588fc",
      size: 111928,
      checksum: "448a33cd65c47bed1eeb4d72e7fa022c95a41158",
      timestamp: 1551981674191,
      hour_from: 1506402000000,
      tile_id: 377894442,
      crc: null
    };

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
          }
        ])
      )
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/blob/v1/layers/test-layed-id/data/8c0e5ac9-b036-4365-8820-dfcba64588fc`,
      new Response(mockedData)
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const indexClient = new IndexLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );

    const data = await indexClient.getData(mockedModel);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(2);
    const calls = fetchStub.getCalls();
    calls.forEach(call => {
      const callHeaders = call.args[1].headers;
      expect(callHeaders.get("User-Agent")).equals(`OLP-TS-SDK/${LIB_VERSION}`);
    });
  });
});
