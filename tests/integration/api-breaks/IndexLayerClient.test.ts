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

import * as chai from "chai";
import sinonChai = require("sinon-chai");
import {
  IndexLayerClient,
  OlpClientSettings,
  HRN,
  IndexLayerClientParams,
  IndexQueryRequest
} from "@here/olp-sdk-dataservice-read";
import { IndexApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("IndexLayerClientParams", function() {
  it("IndexLayerClientParams with all required params", function() {
    const params: IndexLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::example-catalog"),
      layerId: "mocked-layer-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
      })
    };

    assert.isDefined(params);
  });

  it("IndexLayerClientParams with all required and optional params", function() {
    const params: IndexLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::example-catalog"),
      layerId: "mocked-layer-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
      })
    };

    assert.isDefined(params);
  });
});

describe("IndexLayerClient", function() {
  class IndexLayerClientTest extends IndexLayerClient {
    constructor(params: IndexLayerClientParams) {
      super(params);
    }

    async getData(
      model: IndexApi.Index,
      abortSignal?: AbortSignal
    ): Promise<Response> {
      return Promise.resolve(new Response());
    }

    async getPartitions(
      request: IndexQueryRequest,
      abortSignal?: AbortSignal
    ): Promise<IndexApi.Index[]> {
      return Promise.resolve([]);
    }
  }

  beforeEach(function() {
    IndexLayerClientTest;
  });

  it("Shoud be initialized with arguments", async function() {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new IndexLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(IndexLayerClient);

    assert.isFunction(layerClient.getData);
    assert.isFunction(layerClient.getPartitions);
    assert.isDefined(layerClient.hrn);
    assert.isDefined(layerClient.layerId);
    assert.isDefined(layerClient.settings);
  });

  it("Shoud be initialized with IndexLayerClientParams", async function() {
    const layerClient = new IndexLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(IndexLayerClient);

    assert.isFunction(layerClient.getData);
    assert.isFunction(layerClient.getPartitions);
    assert.isDefined(layerClient.hrn);
    assert.isDefined(layerClient.layerId);
    assert.isDefined(layerClient.settings);
  });

  it("getPartitions method with IndexQueryRequest", async function() {
    const layerClient = new IndexLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const response = layerClient.getPartitions(new IndexQueryRequest());
    assert.isDefined(response);
  });

  it("getPartitions method with IndexQueryRequest and abort signal", async function() {
    const layerClient = new IndexLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const response = layerClient.getPartitions(
      new IndexQueryRequest(),
      abortController.signal
    );
    assert.isDefined(response);
  });

  it("getData method with model", async function() {
    const layerClient = new IndexLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const mockedModel = {
      id: "8c0e5ac9-b036-4365-8820-dfcba64588fc",
      size: 111928,
      checksum: "448a33cd65c47bed1eeb4d72e7fa022c95a41158",
      timestamp: 1551981674191,
      hour_from: 1506402000000,
      tile_id: 377894442,
      crc: null
    };
    const response = await layerClient.getData(mockedModel);

    assert.isDefined(response);
  });

  it("getData method with empty model", async function() {
    const layerClient = new IndexLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const mockedModel = {};
    const response = await layerClient.getData(mockedModel);

    assert.isDefined(response);
  });

  it("getData method with model and abort signal", async function() {
    const layerClient = new IndexLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const mockedModel = {
      id: "8c0e5ac9-b036-4365-8820-dfcba64588fc",
      size: 111928,
      checksum: "448a33cd65c47bed1eeb4d72e7fa022c95a41158",
      timestamp: 1551981674191,
      hour_from: 1506402000000,
      tile_id: 377894442,
      crc: null
    };

    const response = await layerClient.getData(
      mockedModel,
      abortController.signal
    );

    assert.isDefined(response);
  });
});
