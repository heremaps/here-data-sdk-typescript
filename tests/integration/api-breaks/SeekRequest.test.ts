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
import { SeekRequest } from "@here/olp-sdk-dataservice-read";
import { StreamApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SeekRequest", () => {
  class SeekRequestTest extends SeekRequest {
    getMode(): "serial" {
      return "serial";
    }

    withMode(mode: "serial"): SeekRequest {
      return this;
    }

    getSubscriptionId(): string {
      return "subscription-id";
    }

    withSubscriptionId(id: string): SeekRequest {
      return this;
    }

    getSeekOffsets(): StreamApi.SeekOffsetsRequest | undefined {
      return {
        offsets: [
          {
            partition: 1,
            offset: 1
          }
        ]
      };
    }

    withSeekOffsets(offsets: StreamApi.SeekOffsetsRequest): SeekRequest {
      return this;
    }
  }

  it("Shoud be initialized", async () => {
    const request = new SeekRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(SeekRequest);

    assert.isFunction(request.withMode);
    assert.isFunction(request.getMode);
    assert.isFunction(request.withSubscriptionId);
    assert.isFunction(request.getSubscriptionId);
    assert.isFunction(request.withSeekOffsets);
    assert.isFunction(request.getSeekOffsets);
  });

  it("Test withMode method with mode", async () => {
    const request = new SeekRequestTest();

    const response = request.withMode("serial");
    assert.isDefined(response);
  });

  it("Test getMode method without params", async () => {
    const request = new SeekRequestTest();

    const response = request.getMode();
    assert.isDefined(response);
  });

  it("Test withSubscriptionId method with id", async () => {
    const request = new SeekRequestTest();

    const response = request.withSubscriptionId("test");
    assert.isDefined(response);
  });

  it("Test getSubscriptionId method without params", async () => {
    const request = new SeekRequestTest();

    const response = request.getSubscriptionId();
    assert.isDefined(response);
  });

  it("Test withSeekOffsets method with offsets", async () => {
    const request = new SeekRequestTest();

    const response = request.withSeekOffsets({
      offsets: [
        {
          partition: 1,
          offset: 1
        }
      ]
    });
    assert.isDefined(response);
  });

  it("Test getSeekOffsets method without params", async () => {
    const request = new SeekRequestTest();

    const response = request.getSeekOffsets();
    assert.isDefined(response);
  });
});
