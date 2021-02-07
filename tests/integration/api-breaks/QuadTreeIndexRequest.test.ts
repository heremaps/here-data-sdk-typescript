/*
 * Copyright (C) 2020-2021 HERE Europe B.V.
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
  QuadTreeIndexDepth,
  QuadTreeIndexRequest
} from "@here/olp-sdk-dataservice-read";
import { AdditionalFields } from "@here/olp-sdk-dataservice-api";
import { QuadKey, HRN } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("QuadTreeIndexRequest", function() {
  class QuadTreeIndexRequestTest extends QuadTreeIndexRequest {
    withVersion(version?: number): QuadTreeIndexRequest {
      return this;
    }

    withQuadKey(quadKey: QuadKey): QuadTreeIndexRequest {
      return this;
    }

    withDepth(depth: QuadTreeIndexDepth): QuadTreeIndexRequest {
      return this;
    }

    withBillingTag(tag: string): QuadTreeIndexRequest {
      return this;
    }

    withAdditionalFields(
      additionalFields?: AdditionalFields
    ): QuadTreeIndexRequest {
      return this;
    }

    getVersion(): number {
      return 10;
    }

    getQuadKey(): QuadKey {
      return {
        row: 5,
        column: 5,
        level: 5
      };
    }

    getDepth(): QuadTreeIndexDepth {
      return 0;
    }

    getBillingTag(): string {
      return "test-billing-tag";
    }

    getAdditionalFields(): AdditionalFields {
      return ["dataSize"];
    }
  }

  it("Shoud be initialized", async function() {
    const request = new QuadTreeIndexRequest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );
    assert.isDefined(request);
    expect(request).to.be.instanceOf(QuadTreeIndexRequest);

    assert.isFunction(request.withBillingTag);
    assert.isFunction(request.getBillingTag);
  });

  it("Test withVersion method with version", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.withVersion(3);
    assert.isDefined(response);
  });

  it("Test withVersion method without params", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.withVersion();
    assert.isDefined(response);
  });

  it("Test getVersion method without params", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.getVersion();
    assert.isDefined(response);
  });

  it("Test withDepth method with depth", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.withDepth(3);
    assert.isDefined(response);
  });

  it("Test getDepth method without params", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.getDepth();
    assert.isDefined(response);
  });

  it("Test withQuadKey method with quadKey", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.withQuadKey({
      row: 5,
      column: 5,
      level: 5
    });
    assert.isDefined(response);
  });

  it("Test getQuadKey method without params", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.getQuadKey();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.getBillingTag();
    assert.isDefined(response);
  });

  it("Test withAdditionalFields method with additionalFields", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.withAdditionalFields(["dataSize"]);
    assert.isDefined(response);
  });

  it("Test getAdditionalFields method without params", async function() {
    const request = new QuadTreeIndexRequestTest(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "id",
      "versioned"
    );

    const response = request.getAdditionalFields();
    assert.isDefined(response);
  });
});
