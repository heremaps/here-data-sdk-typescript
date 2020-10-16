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

import { StreamApi } from "@here/olp-sdk-dataservice-api";
import {
  BootstrapServer,
  CommitOffsetsRequest,
  ConsumeDataResponse,
  ConsumerSubscribeResponse,
  ErrorResponse,
  InlineResponse401,
  InlineResponse403,
  ConsumerProperties,
  Message,
  Metadata,
  StreamOffset,
  SeekOffsetsRequest,
  StreamLayerEndpointResponse
} from "@here/olp-sdk-dataservice-api/lib/stream-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StreamApi", function() {
  it("BootstrapServer with all required params", function() {
    const params: BootstrapServer = {
      hostname: "test",
      port: 1
    };

    assert.isDefined(params);
  });

  it("CommitOffsetsRequest with all required params", function() {
    const params: CommitOffsetsRequest = {};

    assert.isDefined(params);
  });

  it("CommitOffsetsRequest with all required and optional params", function() {
    const params: CommitOffsetsRequest = {
      offsets: [
        {
          partition: 1,
          offset: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("ConsumeDataResponse with all required params", function() {
    const params: ConsumeDataResponse = {
      messages: [
        {
          metaData: {
            partition: "test",
            checksum: "test",
            compressedDataSize: 1,
            dataSize: 1,
            data: "test",
            dataHandle: "test",
            timestamp: 1
          },
          offset: {
            partition: 1,
            offset: 1
          }
        }
      ]
    };

    assert.isDefined(params);
  });

  it("ConsumerSubscribeResponse with all required params", function() {
    const params: ConsumerSubscribeResponse = {};

    assert.isDefined(params);
  });

  it("ConsumerSubscribeResponse with all required and optional params", function() {
    const params: ConsumerSubscribeResponse = {
      nodeBaseURL: "test",
      subscriptionId: "test"
    };

    assert.isDefined(params);
  });

  it("ErrorResponse with all required params", function() {
    const params: ErrorResponse = {
      title: "test",
      status: 1,
      code: "test",
      cause: "test",
      action: "test",
      correlationId: "test"
    };

    assert.isDefined(params);
  });

  it("InlineResponse401 with all required params", function() {
    const params: InlineResponse401 = {};

    assert.isDefined(params);
  });

  it("InlineResponse401 with all required and optional params", function() {
    const params: InlineResponse401 = {
      error: "test",
      errorDescription: "test"
    };

    assert.isDefined(params);
  });

  it("InlineResponse403  with all required params", function() {
    const params: InlineResponse403 = {};

    assert.isDefined(params);
  });

  it("InlineResponse403  with all required and optional params", function() {
    const params: InlineResponse403 = {
      error: "test",
      errorDescription: "test"
    };

    assert.isDefined(params);
  });

  it("ConsumerProperties with all required params", function() {
    const params: ConsumerProperties = {
      ["test"]: "test"
    };

    assert.isDefined(params);
  });

  it("Message with all required params", function() {
    const params: Message = {
      metaData: {
        partition: "test",
        checksum: "test",
        compressedDataSize: 1,
        dataSize: 1,
        data: "test",
        dataHandle: "test",
        timestamp: 1
      },
      offset: {
        partition: 1,
        offset: 1
      }
    };

    assert.isDefined(params);
  });

  it("Metadata with all required params", function() {
    const params: Metadata = {
      partition: "test"
    };

    assert.isDefined(params);
  });

  it("Metadata with all required and optional params", function() {
    const params: Metadata = {
      partition: "test",
      checksum: "test",
      compressedDataSize: 1,
      dataSize: 1,
      data: "test",
      dataHandle: "test",
      timestamp: 1
    };

    assert.isDefined(params);
  });

  it("SeekOffsetsRequest with all required params", function() {
    const params: SeekOffsetsRequest = {};

    assert.isDefined(params);
  });

  it("SeekOffsetsRequest with all required and optional params", function() {
    const params: SeekOffsetsRequest = {
      offsets: [
        {
          partition: 1,
          offset: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("StreamLayerEndpointResponse with all required params", function() {
    const params: StreamLayerEndpointResponse = {
      kafkaProtocolVersion: ["0.10"],
      topic: "test",
      clientId: "test",
      consumerGroupPrefix: "test",
      bootstrapServers: [
        {
          hostname: "test",
          port: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("StreamLayerEndpointResponse with all required and optional params", function() {
    const params: StreamLayerEndpointResponse = {
      kafkaProtocolVersion: ["0.10"],
      topic: "test",
      clientId: "test",
      consumerGroupPrefix: "test",
      bootstrapServers: [
        {
          hostname: "test",
          port: 1
        }
      ],
      bootstrapServersInternal: [
        {
          hostname: "test",
          port: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("StreamOffset with all required params", function() {
    const params: StreamOffset = {
      partition: 1,
      offset: 1
    };

    assert.isDefined(params);
  });

  it("Test doCommitOffsets method with all required params", async function() {
    const params = {
      layerId: "mocked-id",
      commitOffsets: {
        offsets: [
          {
            partition: 25,
            offset: 3
          }
        ]
      }
    };

    const result = await StreamApi.doCommitOffsets(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test doCommitOffsets method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      subscriptionId: "test-subscriptionId",
      xCorrelationId: "test-xCorrelationId",
      commitOffsets: {
        offsets: [
          {
            partition: 25,
            offset: 3
          }
        ]
      }
    };

    const result = await StreamApi.doCommitOffsets(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test consumeData method with all required params", async function() {
    const params = {
      layerId: "mocked-id"
    };

    const result = await StreamApi.consumeData(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test consumeData method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      subscriptionId: "test-subscriptionId",
      xCorrelationId: "test-xCorrelationId"
    };

    const result = await StreamApi.consumeData(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test deleteSubscription method with all required params", async function() {
    const params = {
      layerId: "mocked-id"
    };

    const result = await StreamApi.deleteSubscription(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test deleteSubscription method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      subscriptionId: "test-subscriptionId",
      xCorrelationId: "test-xCorrelationId"
    };

    const result = await StreamApi.deleteSubscription(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test endpoint method with all required params", async function() {
    const params = {
      layerId: "mocked-id"
    };

    const result = await StreamApi.endpoint(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test seekToOffset method with all required params", async function() {
    const params = {
      layerId: "mocked-id",
      seekOffsets: {
        offsets: [
          {
            partition: 88,
            offset: 69
          }
        ]
      }
    };

    const result = await StreamApi.seekToOffset(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test seekToOffset method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      seekOffsets: {
        offsets: [
          {
            partition: 88,
            offset: 69
          }
        ]
      },
      subscriptionId: "test-subscriptionId",
      xCorrelationId: "test-xCorrelationId"
    };

    const result = await StreamApi.seekToOffset(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test subscribe method with all required params", async function() {
    const params = {
      layerId: "mocked-id"
    };

    const result = await StreamApi.subscribe(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test subscribe method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      subscriptionId: "testSubsId",
      consumerId: "testConsumerId",
      subscriptionProperties: {
        autoCommitIntervalMs: 25,
        autoOffsetReset: "earliest"
      }
    };

    const result = await StreamApi.subscribe(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });
});
