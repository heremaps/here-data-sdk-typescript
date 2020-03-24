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
import { HRN, SchemaDetailsRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SchemaDetailsRequest", () => {
  class SchemaDetailsRequestTest extends SchemaDetailsRequest {
    getSchema(): HRN {
      return HRN.fromString("hrn:here:data:::test-hrn");
    }

    withSchema(schemaHrn: HRN): SchemaDetailsRequest {
      return this;
    }

    withBillingTag(tag: string): SchemaDetailsRequest {
      return this;
    }

    getBillingTag(): string {
      return "billing-tag";
    }
  }

  it("Shoud be initialized", async () => {
    const request = new SchemaDetailsRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(SchemaDetailsRequest);

    assert.isFunction(request.withSchema);
    assert.isFunction(request.getSchema);
    assert.isFunction(request.withBillingTag);
    assert.isFunction(request.getBillingTag);
  });

  it("Test withSchema method with schema", async () => {
    const request = new SchemaDetailsRequestTest();

    const response = request.withSchema(
      HRN.fromString("hrn:here:data:::test-hrn")
    );
    assert.isDefined(response);
  });

  it("Test getSchema method without params", async () => {
    const request = new SchemaDetailsRequestTest();

    const response = request.getSchema();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async () => {
    const request = new SchemaDetailsRequestTest();

    const response = request.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async () => {
    const request = new SchemaDetailsRequestTest();

    const response = request.getBillingTag();
    assert.isDefined(response);
  });
});
