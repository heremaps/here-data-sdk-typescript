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
import { CatalogsRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogsRequest", function() {
  class CatalogsRequestTest extends CatalogsRequest {
    withSchema(schemaHrn: string): CatalogsRequest {
      return this;
    }
    getSchema(): string {
      return "schema-hrn";
    }

    withBillingTag(tag: string): CatalogsRequest {
      return this;
    }

    getBillingTag(): string {
      return "billing-tag";
    }
  }

  it("Shoud be initialized", async function() {
    const catalogsRequest = new CatalogsRequestTest();
    assert.isDefined(catalogsRequest);
    expect(catalogsRequest).to.be.instanceOf(CatalogsRequest);

    assert.isFunction(catalogsRequest.withBillingTag);
    assert.isFunction(catalogsRequest.getBillingTag);
  });

  it("Test withSchema method with schemaHrn", async function() {
    const catalogsRequest = new CatalogsRequestTest();

    const response = catalogsRequest.withSchema("test");
    assert.isDefined(response);
  });

  it("Test getSchema method without params", async function() {
    const catalogsRequest = new CatalogsRequestTest();

    const response = catalogsRequest.getSchema();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async function() {
    const catalogsRequest = new CatalogsRequestTest();

    const response = catalogsRequest.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async function() {
    const catalogsRequest = new CatalogsRequestTest();

    const response = catalogsRequest.getBillingTag();
    assert.isDefined(response);
  });
});
