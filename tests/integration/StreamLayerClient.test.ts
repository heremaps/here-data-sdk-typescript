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
  StreamLayerClient,
  SubscribeRequest,
  PollRequest,
  UnsubscribeRequest,
  SeekRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";
import { Buffer } from "buffer";
import { Message } from "@here/olp-sdk-dataservice-api/lib/stream-api";

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
      settings
    };
    const streamLayerClient = new StreamLayerClient(streamLayerClientParams);

    assert.isDefined(streamLayerClient);
    expect(streamLayerClient).to.be.instanceOf(StreamLayerClient);
    assert.equal(streamLayerClient["layerId"], "test-layed-id");
  });

  it("Shoud getData() fetch data with dataHandle", async () => {
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

  it("Should getData() method handle error", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const streamClient = new StreamLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    });

    const data = await streamClient.getData({} as Message).catch(error => {
      expect(error.message).to.be.equal("No data handle for this partition");
    });
  });

  it("Should subscribe() method return data", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("X-Correlation-Id", "9141392.f96875c-9422-4df4-b5ff");

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const streamClient = new StreamLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    });

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "stream",
            version: "v2",
            baseURL: "https://stream.data.api.platform.here.com/stream/v2",
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
      `https://stream.data.api.platform.here.com/stream/v2/layers/test-layed-id/subscribe?subscriptionId=9141392.f96875c`,
      new Response(
        JSON.stringify({
          subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459"
        }),
        { headers }
      )
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new SubscribeRequest().withSubscriptionId(
      "9141392.f96875c"
    );

    const result = await streamClient.subscribe(request);

    assert.isDefined(result);
    expect(result).equal("-9141392.f96875c-9422-4df4-b5ff-41a4f459");
  });

  it("Should poll() method get messages from stream layer", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    const commitOffsetsResponse = new Response("Ok");
    headers.append("X-Correlation-Id", "9141392.f96875c-9422-4df4-bdfj");
    const mockResponse = {
      messages: [
        {
          metaData: {
            partition: "314010583",
            checksum: "ff7494d6f17da702862e550c907c0a91",
            compressedDataSize: 152417,
            dataSize: 100500,
            data: "",
            dataHandle: "iVBORw0-Lf9HdIZBfNEiKAA-AAAE-lFTkSuQmCC",
            timestamp: 1517916706
          },
          offset: {
            partition: 7,
            offset: 38562
          }
        },
        {
          metaData: {
            partition: "314010584",
            checksum: "ff7494d6f17da702862e550c907c0a91",
            dataSize: 100500,
            data: "7n348c7y49nry394y39yv39y384tvn3984tvn34ty034ynt3yvt983ny",
            dataHandle: "",
            timestamp: 1517916707
          },
          offset: {
            partition: 8,
            offset: 38563
          }
        }
      ]
    };

    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const streamClient = new StreamLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    });

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "stream",
            version: "v2",
            baseURL: "https://stream.data.api.platform.here.com/stream/v2",
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
      `https://stream.data.api.platform.here.com/stream/v2/layers/test-layed-id/subscribe`,
      new Response(
        JSON.stringify({
          subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459",
          nodeBaseURL: "nodeBaseUrl"
        }),
        { headers }
      )
    );

    mockedResponses.set(
      "nodeBaseUrl/layers/test-layed-id/partitions?subscriptionId=-9141392.f96875c-9422-4df4-b5ff-41a4f459",
      new Response(JSON.stringify(mockResponse), { headers })
    );

    mockedResponses.set(
      "nodeBaseUrl/layers/test-layed-id/offsets?subscriptionId=-9141392.f96875c-9422-4df4-b5ff-41a4f459",
      new Response(JSON.stringify(commitOffsetsResponse))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);
    const requestS = new SubscribeRequest();
    const subscribtionId = await streamClient.subscribe(requestS);
    const requestP = new PollRequest().withSubscriptionId(subscribtionId);
    const messages = await streamClient.poll(requestP);

    assert.isDefined(messages);
    expect(messages.length).to.be.equal(2);
    expect(messages[0].metaData.dataSize).to.be.equal(100500);
  });

  it("Should poll() method handle errors", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const streamClient = new StreamLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    });

    const request1 = new PollRequest().withMode("parallel");
    const messages1 = await streamClient.poll(request1).catch(error => {
      expect(error.message).to.be.equal(
        "Error: for 'parallel' mode 'subscriptionId' is required."
      );
    });

    const request2 = new PollRequest().withSubscriptionId("test-id");
    const messages2 = await streamClient.poll(request2).catch(error => {
      expect(error.message).to.be.equal(
        `No valid nodeBaseurl provided for the subscribtion id=test-id, please check your subscribtion`
      );
    });
  });

  it("Shoult unsubscribe() method cancel subscription", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("X-Correlation-Id", "9141392.f96875c-9422-4df4-b5ff");

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "stream",
            version: "v2",
            baseURL: "https://stream.data.api.platform.here.com/stream/v2",
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
      `https://stream.data.api.platform.here.com/stream/v2/layers/test-layed-id/subscribe`,
      new Response(
        JSON.stringify({
          subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459",
          nodeBaseURL: "nodeBaseUrl"
        }),
        { headers }
      )
    );

    mockedResponses.set(
      "nodeBaseUrl/layers/test-layed-id/subscribe?subscriptionId=-9141392.f96875c-9422-4df4-b5ff-41a4f459",
      new Response(
        JSON.stringify({
          status: 200
        })
      )
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

    const subscribtionId = await streamClient.subscribe(new SubscribeRequest());
    const request = new UnsubscribeRequest().withSubscriptionId(subscribtionId);
    const unsubscription = await streamClient.unsubscribe(request);

    assert.isDefined(unsubscription);
    expect(unsubscription.status).to.be.equal(200);
  });

  it("Should unsubscribe() method handle errors", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const streamClient = new StreamLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      layerId: "test-layed-id",
      settings: settings
    });

    const request1 = new UnsubscribeRequest().withMode("parallel");
    const messages1 = await streamClient.unsubscribe(request1).catch(error => {
      expect(error.message).to.be.equal(
        "Error: for 'parallel' mode 'subscriptionId' is required."
      );
    });

    const request2 = new UnsubscribeRequest().withSubscriptionId("test-id");
    const messages2 = await streamClient.unsubscribe(request2).catch(error => {
      expect(error.message).to.be.equal(
        `Subscribtion error. No valid nodeBaseurl provided for the subscribtion id=test-id, please check your subscribtion`
      );
    });
  });

  it("Should seek() method handle errors", async () => {
    const mockedResponses = new Map();
    const headers = new Headers();
    headers.append("X-Correlation-Id", "9141392.f96875c-9422-4df4-b5ff");
    const mockOffsets = {
      offsets: [
        {
          partition: 1,
          offset: 1
        },
        {
          partition: 2,
          offset: 2
        }
      ]
    };

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "stream",
            version: "v2",
            baseURL: "https://stream.data.api.platform.here.com/stream/v2",
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
      `https://stream.data.api.platform.here.com/stream/v2/layers/test-layed-id/subscribe?mode=serial&consumerId=consumer-id`,
      new Response(
        JSON.stringify({
          subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459",
          nodeBaseURL: "nodeBaseUrl"
        }),
        { headers }
      )
    );

    mockedResponses.set(
      "nodeBaseUrl/layers/test-layed-id/seek?subscriptionId=test-id&mode=serial",
      new Response(
        JSON.stringify({
          status: 200
        })
      )
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

    const request = new SeekRequest();
    const messages1 = await streamClient.seek(request).catch(error => {
      expect(error.message).to.be.equal(`Error: offsets are required.`);
    });

    request.withSeekOffsets(mockOffsets);

    const messages2 = await streamClient
      .seek(request.withMode("parallel"))
      .catch(error => {
        expect(error.message).to.be.equal(
          "Error: for 'parallel' mode 'subscriptionId' is required."
        );
      });

    const messages3 = await streamClient
      .seek(request.withSubscriptionId("test-id"))
      .catch(error => {
        expect(error.message).to.be.equal(
          `Subscribtion error. No valid nodeBaseurl provided for the subscribtion id=test-id, please check your subscribtion`
        );
      });

    request.withMode("serial");
    const subRequest = new SubscribeRequest()
      .withMode("serial")
      .withConsumerId("consumer-id")
      .withSubscriptionProperties({});
    const subscribtionId = await streamClient.subscribe(subRequest);
    const messages4 = await streamClient.seek(request);

    assert.isDefined(messages4);
    expect(messages4.status).to.be.equal(200);
  });
});
