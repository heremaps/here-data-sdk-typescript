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
  VersionedLayerClient,
  OlpClientSettings,
  HRN,
  VersionedLayerClientParams,
  QuadKeyPartitionsRequest,
  DataRequest,
  PartitionsRequest
} from "@here/olp-sdk-dataservice-read";
import { QueryApi, MetadataApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VersionedLayerClientParams", function() {
  it("VersionedLayerClientParams with all required params", function() {
    const params: VersionedLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::example-catalog"),
      layerId: "mocked-layer-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
      })
    };

    assert.isDefined(params);
  });

  it("VersionedLayerClientParams with all required and optional params", function() {
    const params: VersionedLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::example-catalog"),
      layerId: "mocked-layer-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
      }),
      version: 4
    };

    assert.isDefined(params);
  });
});

describe("VersionedLayerClient", function() {
  class VersionedLayerClientTest extends VersionedLayerClient {
    constructor(params: VersionedLayerClientParams) {
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

  beforeEach(function() {
    VersionedLayerClientTest;
  });

  it("Shoud be initialized with arguments", async function() {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings
    });
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(VersionedLayerClient);

    assert.isFunction(layerClient.getData);
    assert.isFunction(layerClient.getPartitions);
  });

  it("Shoud be initialized with VersionedLayerClientParams", async function() {
    const layerClient = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(VersionedLayerClient);

    assert.isFunction(layerClient.getData);
    assert.isFunction(layerClient.getPartitions);
  });

  it("getPartitions method with QuadKeyPartitionsRequest", async function() {
    const layerClient = new VersionedLayerClientTest({
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

  it("getPartitions method with QuadKeyPartitionsRequest and abort signal", async function() {
    const layerClient = new VersionedLayerClientTest({
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

  it("getPartitions method with PartitionsRequest", async function() {
    const layerClient = new VersionedLayerClientTest({
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

  it("getPartitions method with PartitionsRequest and abort signal", async function() {
    const layerClient = new VersionedLayerClientTest({
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

  it("getData method method with dataHandle", async function() {
    const layerClient = new VersionedLayerClientTest({
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

  it("getData method method with dataHandle and abort signal", async function() {
    const layerClient = new VersionedLayerClientTest({
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
