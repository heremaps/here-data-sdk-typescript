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
import { IndexQueryRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("IndexQueryRequest", function() {
  class IndexQueryRequestTest extends IndexQueryRequest {
    withQueryString(query?: string): IndexQueryRequest {
      return this;
    }

    getQueryString(): string {
      return "test-query-string";
    }

    withHugeResponse(isHuge: boolean): IndexQueryRequest {
      return this;
    }

    getHugeResponse(): boolean {
      return true;
    }
  }

  it("Shoud be initialized", async function() {
    const request = new IndexQueryRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(IndexQueryRequest);

    assert.isFunction(request.withHugeResponse);
    assert.isFunction(request.getHugeResponse);
    assert.isFunction(request.withQueryString);
    assert.isFunction(request.getQueryString);
  });

  it("Test withHugeResponse method with isHuge", async function() {
    const request = new IndexQueryRequestTest();

    const response = request.withHugeResponse(true);
    assert.isDefined(response);
  });

  it("Test getHugeResponse method without params", async function() {
    const request = new IndexQueryRequestTest();

    const response = request.getHugeResponse();
    assert.isDefined(response);
  });

  it("Test withQueryString method with query", async function() {
    const request = new IndexQueryRequestTest();

    const response = request.withQueryString("test");
    assert.isDefined(response);
  });

  it("Test withQueryString method without params", async function() {
    const request = new IndexQueryRequestTest();

    const response = request.withQueryString();
    assert.isDefined(response);
  });

  it("Test getQueryString method without params", async function() {
    const request = new IndexQueryRequestTest();

    const response = request.getQueryString();
    assert.isDefined(response);
  });
});
