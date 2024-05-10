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
import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { QueryClient } from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";
import { HRN, OlpClientSettings } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("QueryClient", function() {
  class QueryClientTest extends QueryClient {
    constructor(settings: OlpClientSettings) {
      super(settings);
    }

    public async fetchQuadTreeIndex(
      request: dataServiceRead.QuadTreeIndexRequest,
      abortSignal?: AbortSignal
    ): Promise<dataServiceApi.QueryApi.Index> {
      return {
        status: 1,
        title: "test"
      };
    }

    public async getPartitionsById(
      request: dataServiceRead.PartitionsRequest,
      layerId: string,
      hrn: HRN,
      abortSignal?: AbortSignal
    ): Promise<dataServiceApi.QueryApi.Partitions> {
      return {
        status: 11,
        title: "test"
      };
    }
  }

  let settings = new OlpClientSettings({
    environment: "here",
    getToken: () => Promise.resolve("mocked-token")
  });

  const testCatalogHrn = HRN.fromString("hrn:here:data:::mocked-hrn");

  it("Shoud be initialized with arguments", async function() {
    const queryClient = new QueryClient(settings);
    assert.isDefined(queryClient);

    expect(queryClient).to.be.instanceOf(QueryClient);
    assert.isDefined(queryClient.fetchQuadTreeIndex);
    assert.isDefined(queryClient.getPartitionsById);
  });

  it("Test fetchQuadTreeIndex method with required params", async function() {
    const client = new QueryClientTest(settings);

    const response = await client.fetchQuadTreeIndex(
      new dataServiceRead.QuadTreeIndexRequest(testCatalogHrn, "test-layer-id")
    );
    assert.isDefined(response);
  });

  it("Test fetchQuadTreeIndex method with required and optional params", async function() {
    const client = new QueryClientTest(settings);
    const controller = new AbortController();

    const response = await client.fetchQuadTreeIndex(
      new dataServiceRead.QuadTreeIndexRequest(testCatalogHrn, "test-layer-id"),
      controller.signal
    );
    assert.isDefined(response);
  });

  it("Test getPartitionsById method with required params", async function() {
    const client = new QueryClientTest(settings);

    const response = await client.getPartitionsById(
      new dataServiceRead.PartitionsRequest(),
      "test-layer-id",
      testCatalogHrn
    );
    assert.isDefined(response);
  });

  it("Test getPartitionsById method with required and optional params", async function() {
    const client = new QueryClientTest(settings);
    const controller = new AbortController();

    const response = await client.getPartitionsById(
      new dataServiceRead.PartitionsRequest(),
      "test-layer-id",
      testCatalogHrn,
      controller.signal
    );
    assert.isDefined(response);
  });
});
