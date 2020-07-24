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
import { CatalogRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogRequest", function() {
  class CatalogRequestTest extends CatalogRequest {
    withBillingTag(tag: string): CatalogRequest {
      return this;
    }

    getBillingTag(): string {
      return "billing-tag";
    }
  }

  it("Shoud be initialized", async function() {
    const catalogRequest = new CatalogRequestTest();
    assert.isDefined(catalogRequest);
    expect(catalogRequest).to.be.instanceOf(CatalogRequest);

    assert.isFunction(catalogRequest.withBillingTag);
    assert.isFunction(catalogRequest.getBillingTag);
  });

  it("Test withBillingTag method with tag", async function() {
    const catalogRequest = new CatalogRequestTest();

    const response = catalogRequest.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async function() {
    const catalogRequest = new CatalogRequestTest();
    catalogRequest.withBillingTag("test-tag");

    const response = catalogRequest.getBillingTag();
    assert.isDefined(response);
  });
});
