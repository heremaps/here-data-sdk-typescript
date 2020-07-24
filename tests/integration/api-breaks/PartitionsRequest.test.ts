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
import { PartitionsRequest } from "@here/olp-sdk-dataservice-read";
import { AdditionalFields } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("PartitionsRequest", function() {
  class PartitionsRequestTest extends PartitionsRequest {
    withVersion(version?: number): PartitionsRequest {
      return this;
    }
    getVersion(): number {
      return 10;
    }

    withBillingTag(tag: string): PartitionsRequest {
      return this;
    }

    getBillingTag(): string {
      return "billing-tag";
    }

    withPartitionIds(ids: string[]): PartitionsRequest {
      return this;
    }

    getPartitionIds(): string[] {
      return ["partitionIds"];
    }

    withAdditionalFields(
      additionalFields: AdditionalFields
    ): PartitionsRequest {
      return this;
    }

    getAdditionalFields(): AdditionalFields {
      return ["dataSize"];
    }
  }

  it("Shoud be initialized", async function() {
    const request = new PartitionsRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(PartitionsRequest);

    assert.isFunction(request.withVersion);
    assert.isFunction(request.getVersion);
    assert.isFunction(request.withBillingTag);
    assert.isFunction(request.getBillingTag);
    assert.isFunction(request.withPartitionIds);
    assert.isFunction(request.getPartitionIds);
    assert.isFunction(request.withAdditionalFields);
    assert.isFunction(request.getAdditionalFields);
  });

  it("Test withVersion method with version", async function() {
    const request = new PartitionsRequestTest();

    const response = request.withVersion(5);
    assert.isDefined(response);
  });

  it("Test withVersion method without params", async function() {
    const request = new PartitionsRequestTest();

    const response = request.withVersion();
    assert.isDefined(response);
  });

  it("Test getVersion method without params", async function() {
    const request = new PartitionsRequestTest();

    const response = request.getVersion();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async function() {
    const request = new PartitionsRequestTest();

    const response = request.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async function() {
    const request = new PartitionsRequestTest();

    const response = request.getBillingTag();
    assert.isDefined(response);
  });

  it("Test withPartitionIds method with ids", async function() {
    const request = new PartitionsRequestTest();

    const response = request.withPartitionIds(["test"]);
    assert.isDefined(response);
  });

  it("Test getPartitionIds method without params", async function() {
    const request = new PartitionsRequestTest();

    const response = request.getPartitionIds();
    assert.isDefined(response);
  });

  it("Test withAdditionalFields method with AdditionalFields", async function() {
    const request = new PartitionsRequestTest();

    const response = request.withAdditionalFields(["dataSize"]);
    assert.isDefined(response);
  });

  it("Test getAdditionalFields method without params", async function() {
    const request = new PartitionsRequestTest();

    const response = request.getAdditionalFields();
    assert.isDefined(response);
  });
});
