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
import { SubscribeRequest } from "@here/olp-sdk-dataservice-read";
import { StreamApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SubscribeRequest", () => {
  class SubscribeRequestTest extends SubscribeRequest {
    getMode(): "serial" {
      return "serial";
    }

    withMode(mode: "serial"): SubscribeRequest {
      return this;
    }

    getSubscriptionId(): string {
      return "subscription-id";
    }

    withSubscriptionId(id: string): SubscribeRequest {
      return this;
    }

    getConsumerId(): string {
      return "test";
    }

    withConsumerId(id: string): SubscribeRequest {
      return this;
    }

    getSubscriptionProperties(): StreamApi.ConsumerProperties {
      return {
        "key-test": "test"
      };
    }

    withSubscriptionProperties(
      props: StreamApi.ConsumerProperties
    ): SubscribeRequest {
      return this;
    }
  }

  it("Shoud be initialized", async () => {
    const request = new SubscribeRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(SubscribeRequest);

    assert.isFunction(request.withMode);
    assert.isFunction(request.getMode);
    assert.isFunction(request.withSubscriptionId);
    assert.isFunction(request.getSubscriptionId);
    assert.isFunction(request.withConsumerId);
    assert.isFunction(request.getConsumerId);
    assert.isFunction(request.withSubscriptionProperties);
    assert.isFunction(request.getSubscriptionProperties);
  });

  it("Test withMode method with mode", async () => {
    const request = new SubscribeRequestTest();

    const response = request.withMode("serial");
    assert.isDefined(response);
  });

  it("Test getMode method without params", async () => {
    const request = new SubscribeRequestTest();

    const response = request.getMode();
    assert.isDefined(response);
  });

  it("Test withSubscriptionId method with id", async () => {
    const request = new SubscribeRequestTest();

    const response = request.withSubscriptionId("test");
    assert.isDefined(response);
  });

  it("Test getSubscriptionId method without params", async () => {
    const request = new SubscribeRequestTest();

    const response = request.getSubscriptionId();
    assert.isDefined(response);
  });

  it("Test withConsumerId method with id", async () => {
    const request = new SubscribeRequestTest();

    const response = request.withConsumerId("test");
    assert.isDefined(response);
  });

  it("Test getConsumerId method without params", async () => {
    const request = new SubscribeRequestTest();

    const response = request.getConsumerId();
    assert.isDefined(response);
  });

  it("Test withSubscriptionProperties method with props", async () => {
    const request = new SubscribeRequestTest();

    const response = request.withSubscriptionProperties({
      "key-test": "test"
    });
    assert.isDefined(response);
  });

  it("Test getSubscriptionProperties method without params", async () => {
    const request = new SubscribeRequestTest();

    const response = request.getSubscriptionProperties();
    assert.isDefined(response);
  });
});
