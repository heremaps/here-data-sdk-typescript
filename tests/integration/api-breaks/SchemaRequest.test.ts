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
import { SchemaRequest } from "@here/olp-sdk-dataservice-read";
import { ArtifactApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SchemaRequest", () => {
  class SchemaRequestTest extends SchemaRequest {
    getVariant(): ArtifactApi.Variant {
      return {
        id: "test",
        url: "test"
      };
    }

    withVariant(variant: ArtifactApi.Variant): SchemaRequest {
      return this;
    }

    withBillingTag(tag: string): SchemaRequest {
      return this;
    }

    getBillingTag(): string {
      return "billing-tag";
    }
  }

  it("Shoud be initialized", async () => {
    const request = new SchemaRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(SchemaRequest);

    assert.isFunction(request.withVariant);
    assert.isFunction(request.getVariant);
    assert.isFunction(request.withBillingTag);
    assert.isFunction(request.getBillingTag);
  });

  it("Test withVariant method with variant", async () => {
    const request = new SchemaRequestTest();

    const response = request.withVariant({
      id: "test",
      url: "test"
    });
    assert.isDefined(response);
  });

  it("Test getVariant method without params", async () => {
    const request = new SchemaRequestTest();

    const response = request.getVariant();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async () => {
    const request = new SchemaRequestTest();

    const response = request.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async () => {
    const request = new SchemaRequestTest();

    const response = request.getBillingTag();
    assert.isDefined(response);
  });
});
