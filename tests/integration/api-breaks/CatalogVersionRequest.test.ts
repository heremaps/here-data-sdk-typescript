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
import { CatalogVersionRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogVersionRequest", () => {
  class CatalogVersionRequestTest extends CatalogVersionRequest {
    getStartVersion(): number {
      return 5;
    }

    withStartVersion(version: number): CatalogVersionRequest {
      return this;
    }

    getEndVersion(): number {
      return 25;
    }

    withEndVersion(version: number): CatalogVersionRequest {
      return this;
    }

    withBillingTag(tag: string): CatalogVersionRequest {
      return this;
    }

    getBillingTag(): string {
      return "billing-tag";
    }
  }

  it("Shoud be initialized", async () => {
    const catalogRequest = new CatalogVersionRequestTest();
    assert.isDefined(catalogRequest);
    expect(catalogRequest).to.be.instanceOf(CatalogVersionRequest);

    assert.isFunction(catalogRequest.withStartVersion);
    assert.isFunction(catalogRequest.getStartVersion);
    assert.isFunction(catalogRequest.withEndVersion);
    assert.isFunction(catalogRequest.getEndVersion);
    assert.isFunction(catalogRequest.withBillingTag);
    assert.isFunction(catalogRequest.getBillingTag);
  });

  it("Test withStartVersion method with version", async () => {
    const request = new CatalogVersionRequestTest();

    const response = request.withStartVersion(1);
    assert.isDefined(response);
  });

  it("Test getStartVersion method without params", async () => {
    const request = new CatalogVersionRequestTest();

    const response = request.getStartVersion();
    assert.isDefined(response);
  });

  it("Test withEndVersion method with version", async () => {
    const request = new CatalogVersionRequestTest();

    const response = request.withEndVersion(25);
    assert.isDefined(response);
  });

  it("Test getEndVersion method without params", async () => {
    const request = new CatalogVersionRequestTest();

    const response = request.getEndVersion();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async () => {
    const catalogRequest = new CatalogVersionRequestTest();

    const response = catalogRequest.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async () => {
    const catalogRequest = new CatalogVersionRequestTest();
    catalogRequest.withBillingTag("test-tag");

    const response = catalogRequest.getBillingTag();
    assert.isDefined(response);
  });
});
