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
import { PollRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("PollRequest", function() {
  class PollRequestTest extends PollRequest {
    getMode(): "serial" {
      return "serial";
    }

    withMode(mode: "serial"): PollRequest {
      return this;
    }

    getSubscriptionId(): string {
      return "subscription-id";
    }

    withSubscriptionId(id: string): PollRequest {
      return this;
    }
  }

  it("Shoud be initialized", async function() {
    const request = new PollRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(PollRequest);

    assert.isFunction(request.withMode);
    assert.isFunction(request.getMode);
    assert.isFunction(request.withSubscriptionId);
    assert.isFunction(request.getSubscriptionId);
  });

  it("Test withMode method with mode", async function() {
    const request = new PollRequestTest();

    const response = request.withMode("serial");
    assert.isDefined(response);
  });

  it("Test getMode method without params", async function() {
    const request = new PollRequestTest();

    const response = request.getMode();
    assert.isDefined(response);
  });

  it("Test withSubscriptionId method with id", async function() {
    const request = new PollRequestTest();

    const response = request.withSubscriptionId("test");
    assert.isDefined(response);
  });

  it("Test getSubscriptionId method without params", async function() {
    const request = new PollRequestTest();

    const response = request.getSubscriptionId();
    assert.isDefined(response);
  });
});
