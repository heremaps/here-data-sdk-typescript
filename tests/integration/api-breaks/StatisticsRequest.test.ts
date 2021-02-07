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
import { StatisticsRequest } from "@here/olp-sdk-dataservice-read";
import { HRN } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StatisticsRequest", function() {
  enum CoverageDataType {
    BITMAP = "tilemap",
    SIZEMAP = "heatmap/size",
    TIMEMAP = "heatmap/age"
  }

  class StatisticsRequestTest extends StatisticsRequest {
    /*catalogHrn?: string;
        private layerId?: string;
        private typemap?: CoverageDataType;
        private dataLevel?: number;
        private billingTag?: string;
*/

    getCatalogHrn(): string {
      return "hrn:here:data:::test-hrn";
    }

    getLayerId(): string {
      return "test";
    }

    getTypemap(): CoverageDataType {
      return CoverageDataType.BITMAP;
    }

    getDataLevel(): number | undefined;

    getDataLevel(): string | undefined;

    getDataLevel(): number | string | undefined {
      return 3;
    }

    withCatalogHrn(hrn: HRN): StatisticsRequest {
      return new StatisticsRequest();
    }

    withLayerId(layerId: string): StatisticsRequest {
      return new StatisticsRequest();
    }

    withTypemap(coverageDataType: CoverageDataType): StatisticsRequest {
      return new StatisticsRequest();
    }

    withDataLevel(dataLevel: number): StatisticsRequest;

    withDataLevel(dataLevel: string): StatisticsRequest;

    withDataLevel(dataLevel: string | number) {
      return new StatisticsRequest();
    }

    withBillingTag(tag: string): StatisticsRequest {
      return new StatisticsRequest();
    }

    getBillingTag(): string {
      return "billing-tag";
    }
  }

  it("Shoud be initialized", async function() {
    const request = new StatisticsRequest();
    assert.isDefined(request);
    expect(request).to.be.instanceOf(StatisticsRequest);

    assert.isFunction(request.withTypemap);
    assert.isFunction(request.getTypemap);
    assert.isFunction(request.withCatalogHrn);
    assert.isFunction(request.getCatalogHrn);
    assert.isFunction(request.withDataLevel);
    assert.isFunction(request.getDataLevel);
    assert.isFunction(request.withLayerId);
    assert.isFunction(request.getLayerId);
    assert.isFunction(request.withLayerId);
    assert.isFunction(request.getLayerId);
    assert.isFunction(request.withBillingTag);
    assert.isFunction(request.getBillingTag);
  });

  it("Test withTypemap method with type map", async function() {
    const request = new StatisticsRequestTest();

    const response = request.withTypemap(CoverageDataType.BITMAP);
    assert.isDefined(response);
  });

  it("Test getTypemap method without params", async function() {
    const request = new StatisticsRequestTest();

    const response = request.getTypemap();
    assert.isDefined(response);
  });

  it("Test withCatalogHrn method with hrn", async function() {
    const request = new StatisticsRequestTest();

    const response = request.withCatalogHrn(
      HRN.fromString("hrn:here:data:::test-hrn")
    );
    assert.isDefined(response);
  });

  it("Test getCatalogHrn method without params", async function() {
    const request = new StatisticsRequestTest();

    const response = request.getCatalogHrn();
    assert.isDefined(response);
  });

  it("Test withDataLevel method with dataLevel", async function() {
    const request = new StatisticsRequestTest();

    const response = request.withDataLevel(1);
    assert.isDefined(response);
  });

  it("Test getDataLevel method without params", async function() {
    const request = new StatisticsRequestTest();

    const response = request.getDataLevel();
    assert.isDefined(response);
  });

  it("Test withLayerId method with layerId", async function() {
    const request = new StatisticsRequestTest();

    const response = request.withLayerId("test");
    assert.isDefined(response);
  });

  it("Test getLayerId method without params", async function() {
    const request = new StatisticsRequestTest();

    const response = request.getLayerId();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async function() {
    const request = new StatisticsRequestTest();

    const response = request.withBillingTag("test-tag");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async function() {
    const request = new StatisticsRequestTest();

    const response = request.getBillingTag();
    assert.isDefined(response);
  });
});
