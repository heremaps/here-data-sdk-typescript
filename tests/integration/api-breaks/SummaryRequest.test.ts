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
import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { SummaryRequest } from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SummaryRequest", () => {
  const testCatalogHrn = dataServiceRead.HRN.fromString(
    "hrn:here:data:::mocked-hrn"
  );

  it("Shoud be initialized with arguments", async () => {
    const client = new SummaryRequest();
    assert.isDefined(client);

    expect(client).to.be.instanceOf(SummaryRequest);
    assert.isDefined(client.getLayerId);
    assert.isDefined(client.getBillingTag);
    assert.isDefined(client.getCatalogHrn);
    assert.isDefined(client.withBillingTag);
    assert.isDefined(client.withCatalogHrn);
    assert.isDefined(client.withLayerId);
  });

  it("Test withLayerId method with layerId", async () => {
    const client = new SummaryRequest();

    const response = await client.withLayerId("test");
    assert.isDefined(response);
  });

  it("Test getLayerId method without params", async () => {
    const client = new SummaryRequest();
    await client.withLayerId("test");

    const response = await client.getLayerId();
    assert.isDefined(response);
  });

  it("Test withBillingTag method with tag", async () => {
    const client = new SummaryRequest();

    const response = await client.withBillingTag("test");
    assert.isDefined(response);
  });

  it("Test getBillingTag method without params", async () => {
    const client = new SummaryRequest();
    await client.withBillingTag("test");

    const response = await client.getBillingTag();
    assert.isDefined(response);
  });

  it("Test withCatalogHrn method with hrn", async () => {
    const client = new SummaryRequest();

    const response = await client.withCatalogHrn(testCatalogHrn);
    assert.isDefined(response);
  });

  it("Test getCatalogHrn method without params", async () => {
    const client = new SummaryRequest();
    await client.withCatalogHrn(testCatalogHrn);

    const response = await client.getCatalogHrn();
    assert.isDefined(response);
  });
});
