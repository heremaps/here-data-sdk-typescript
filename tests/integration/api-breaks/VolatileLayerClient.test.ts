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
  VolatileLayerClient,
  OlpClientSettings,
  HRN,
  VolatileLayerClientParams,
  QuadKeyPartitionsRequest,
  DataRequest,
  PartitionsRequest
} from "@here/olp-sdk-dataservice-read";
import { QueryApi, MetadataApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VolatileLayerClientParams", () => {
  it("VolatileLayerClientParams with all required params", () => {
    const params: VolatileLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::example-catalog"),
      layerId: "mocked-layer-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
      })
    };

    assert.isDefined(params);
  });

  it("VolatileLayerClientParams with all required and optional params", () => {
    const params: VolatileLayerClientParams = {
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

describe("VolatileLayerClient", () => {
  class VolatileLayerClientTest extends VolatileLayerClient {
    constructor(params: VolatileLayerClientParams) {
      super(params);
    }

    async getData(
      dataRequest: DataRequest,
      abortSignal?: AbortSignal
    ): Promise<Response> {
      return Promise.resolve(new Response());
    }

    async getPartitions(
      quadKeyPartitionsRequest: QuadKeyPartitionsRequest,
      abortSignal?: AbortSignal
    ): Promise<QueryApi.Index>;
    async getPartitions(
      partitionsRequest: PartitionsRequest,
      abortSignal?: AbortSignal
    ): Promise<MetadataApi.Partitions>;

    async getPartitions(
      request: QuadKeyPartitionsRequest | PartitionsRequest,
      abortSignal?: AbortSignal
    ): Promise<QueryApi.Index | MetadataApi.Partitions | QueryApi.Partitions> {
      return Promise.resolve({});
    }
  }

  beforeEach(() => {
    VolatileLayerClientTest;
  });

  it("Shoud be initialized with arguments", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VolatileLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(VolatileLayerClient);

    assert.isFunction(layerClient.getData);
    assert.isFunction(layerClient.getPartitions);
    assert.isDefined(layerClient.hrn);
    assert.isDefined(layerClient.layerId);
    assert.isDefined(layerClient.settings);
  });

  it("Shoud be initialized with VolatileLayerClientParams", async () => {
    const layerClient = new VolatileLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(VolatileLayerClient);

    assert.isFunction(layerClient.getData);
    assert.isFunction(layerClient.getPartitions);
    assert.isDefined(layerClient.hrn);
    assert.isDefined(layerClient.layerId);
    assert.isDefined(layerClient.settings);
  });

  it("getPartitions method with QuadKeyPartitionsRequest", async () => {
    const layerClient = new VolatileLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const response = layerClient.getPartitions(new QuadKeyPartitionsRequest());
    assert.isDefined(response);
  });

  it("getPartitions method with QuadKeyPartitionsRequest and abort signal", async () => {
    const layerClient = new VolatileLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const response = layerClient.getPartitions(
      new QuadKeyPartitionsRequest(),
      abortController.signal
    );
    assert.isDefined(response);
  });

  it("getPartitions method with PartitionsRequest", async () => {
    const layerClient = new VolatileLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const response = layerClient.getPartitions(new PartitionsRequest());
    assert.isDefined(response);
  });

  it("getPartitions method with PartitionsRequest and abort signal", async () => {
    const layerClient = new VolatileLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const response = layerClient.getPartitions(
      new PartitionsRequest(),
      abortController.signal
    );
    assert.isDefined(response);
  });

  it("getData method method with dataHandle", async () => {
    const layerClient = new VolatileLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const mockedDataHandle = "1b2ca68f-d4a0-4379-8120-cd025640510c";
    const request = new DataRequest().withDataHandle(mockedDataHandle);
    const response = await layerClient.getData(request);

    assert.isDefined(response);
  });

  it("getData method method with dataHandle and abort signal", async () => {
    const layerClient = new VolatileLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const mockedDataHandle = "1b2ca68f-d4a0-4379-8120-cd025640510c";
    const request = new DataRequest().withDataHandle(mockedDataHandle);
    const response = await layerClient.getData(request, abortController.signal);

    assert.isDefined(response);
  });
});
