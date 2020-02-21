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
  HRN,
  StreamLayerClient
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";
import { Buffer } from "buffer";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StreamLayerClient", () => {
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

  it("Shoud be initialized with StreamLayerClientParams", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });

    const streamLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    };
    const streamLayerClient = new StreamLayerClient(streamLayerClientParams);

    assert.isDefined(streamLayerClient);
    expect(streamLayerClient).to.be.instanceOf(StreamLayerClient);
    assert.equal(streamLayerClient["layerId"], "test-layed-id");
  });

  it("Shoud be fetched data with dataHandle", async () => {
    const mockedResponses = new Map();
    const mockedData = Buffer.alloc(42);

    const mockedMessage = {
      metaData: {
        partition: "314010583",
        checksum: "ff7494d6f17da702862e550c907c0a91",
        compressedDataSize: 152417,
        dataSize: 250110,
        data: "",
        dataHandle: "8c0e5ac9-b036-4365-8820-dfcba64588fc",
        timestamp: 1517916706
      },
      offset: {
        partition: 7,
        offset: 38562
      }
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
    const streamClient = new StreamLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    });

    const data = await streamClient.getData(mockedMessage);

    assert.isDefined(data);
    expect(fetchStub.callCount).to.be.equal(2);
  });
});
