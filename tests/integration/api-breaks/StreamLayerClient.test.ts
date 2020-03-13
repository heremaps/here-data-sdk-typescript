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
  StreamLayerClient,
  OlpClientSettings,
  HRN,
  StreamLayerClientParams,
  PollRequest,
  SeekRequest,
  SubscribeRequest,
  UnsubscribeRequest
} from "@here/olp-sdk-dataservice-read";
import { StreamApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StreamLayerClientParams", () => {
  it("StreamLayerClientParams with all required params", () => {
    const params: StreamLayerClientParams = {
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

describe("StreamLayerClient", () => {
  class StreamLayerClientTest extends StreamLayerClient {
    constructor(params: StreamLayerClientParams) {
      super(params);
    }

    async subscribe(
      request: SubscribeRequest,
      abortSignal?: AbortSignal
    ): Promise<string> {
      return Promise.resolve("response");
    }

    async poll(
      request: PollRequest,
      abortSignal?: AbortSignal
    ): Promise<StreamApi.Message[]> {
      return Promise.resolve([]);
    }

    async unsubscribe(
      request: UnsubscribeRequest,
      abortSignal?: AbortSignal
    ): Promise<Response> {
      return Promise.resolve(new Response());
    }

    async getData(
      message: StreamApi.Message,
      abortSignal?: AbortSignal
    ): Promise<Response> {
      return Promise.resolve(new Response());
    }

    async seek(
      request: SeekRequest,
      abortSignal?: AbortSignal
    ): Promise<Response> {
      return Promise.resolve(new Response());
    }
  }

  it("Shoud be initialized with StreamLayerClientParams", async () => {
    const layerClient = new StreamLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(StreamLayerClient);

    assert.isFunction(layerClient.subscribe);
    assert.isFunction(layerClient.poll);
    assert.isFunction(layerClient.unsubscribe);
    assert.isFunction(layerClient.getData);
    assert.isFunction(layerClient.seek);
  });

  it("Test subscribe method method with SubscribeRequest", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const request = new SubscribeRequest();
    const response = await layerClient.subscribe(request);

    assert.isDefined(response);
  });

  it("Test subscribe method method with SubscribeRequest and abort signal", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const request = new SubscribeRequest();
    const response = await layerClient.subscribe(
      request,
      abortController.signal
    );

    assert.isDefined(response);
  });

  it("Test poll method method with PollRequest", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const request = new PollRequest();
    const response = await layerClient.poll(request);

    assert.isDefined(response);
  });

  it("Test poll method method with PollRequest and abort signal", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const request = new PollRequest();
    const response = await layerClient.poll(request, abortController.signal);

    assert.isDefined(response);
  });

  it("Test unsubscribe method method with UnsubscribeRequest", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const request = new UnsubscribeRequest();
    const response = await layerClient.unsubscribe(request);

    assert.isDefined(response);
  });

  it("Test unsubscribe method method with UnsubscribeRequest and abort signal", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const request = new UnsubscribeRequest();
    const response = await layerClient.unsubscribe(
      request,
      abortController.signal
    );

    assert.isDefined(response);
  });

  it("Test getData method method with message", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const message = {
      metaData: { partition: "test" },
      offset: {
        partition: 1,
        offset: 10
      }
    };
    const response = await layerClient.getData(message);

    assert.isDefined(response);
  });

  it("Test getData method method with message and abort signal", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const message = {
      metaData: { partition: "test" },
      offset: {
        partition: 1,
        offset: 10
      }
    };
    const response = await layerClient.getData(message, abortController.signal);

    assert.isDefined(response);
  });

  it("Test seek method method with SeekRequest", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const request = new SeekRequest();
    const response = await layerClient.seek(request);

    assert.isDefined(response);
  });

  it("Test seek method method with SeekRequest and abort signal", async () => {
    const layerClient = new StreamLayerClientTest({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("test-token-string")
      })
    });

    const abortController = new AbortController();

    const request = new SeekRequest();
    const response = await layerClient.seek(request, abortController.signal);

    assert.isDefined(response);
  });
});
