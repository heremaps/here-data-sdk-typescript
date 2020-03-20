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
import { LayerVersionsRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("LayerVersionsRequest", () => {
  class LayerVersionsRequestTest extends LayerVersionsRequest {
    getVersion(): number {
      return 5;
    }

    withVersion(version: number): LayerVersionsRequest {
      return this;
    }

    getBillingTag(): string {
      return "billing-tag";
    }

    withBillingTag(tag: string): LayerVersionsRequest {
      return this;
    }
  }

  it("Shoud be initialized", async () => {
    const request = new LayerVersionsRequestTest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(LayerVersionsRequest);

    assert.isFunction(request.withVersion);
    assert.isFunction(request.getVersion);

    assert.isFunction(request.withBillingTag);
    assert.isFunction(request.getBillingTag);
  });

  it("Test withVersion method with version", async () => {
    const request = new LayerVersionsRequestTest();

    const response = request.withVersion(11);
    assert.isDefined(response);
  });

  it("Test getVersion method without params", async () => {
    const request = new LayerVersionsRequestTest();
    request.withVersion(11);

    const response = request.getVersion();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async () => {
    const request = new LayerVersionsRequestTest();

    const response = request.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async () => {
    const request = new LayerVersionsRequestTest();
    request.withBillingTag("test-tag");

    const response = request.getBillingTag();
    assert.isDefined(response);
  });
});
