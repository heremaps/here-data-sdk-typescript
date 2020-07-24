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

import {
  StatisticsClient,
  OlpClientSettings
} from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StatisticsClient", function() {
  class StatisticsClientTest extends StatisticsClient {
    constructor(settings: OlpClientSettings) {
      super(settings);
    }

    public async getSummary(
      summaryRequest: dataServiceRead.SummaryRequest
    ): Promise<dataServiceApi.CoverageApi.LayerSummary> {
      return {
        catalogHRN: "test",
        layer: "test",
        levelSummary: {
          [1]: {
            boundingBox: {
              east: 1,
              south: 1,
              north: 1,
              west: 1
            },
            size: 1,
            processedTimestamp: 1,
            centroid: 1,
            minPartitionSize: 1,
            maxPartitionSize: 1,
            version: 1,
            totalPartitions: 1
          }
        }
      };
    }

    public async getStatistics(
      statisticsRequest: dataServiceRead.StatisticsRequest
    ): Promise<Response> {
      return Promise.resolve(new Response());
    }
  }

  let settings = new OlpClientSettings({
    environment: "here",
    getToken: () => Promise.resolve("mocked-token")
  });

  it("Shoud be initialized with arguments", async function() {
    const client = new StatisticsClient(settings);
    assert.isDefined(client);

    expect(client).to.be.instanceOf(StatisticsClient);
    assert.isDefined(client.getSummary);
    assert.isDefined(client.getStatistics);
  });

  it("Test getSummary method with summaryRequest", async function() {
    const client = new StatisticsClientTest(settings);

    const response = await client.getSummary(
      new dataServiceRead.SummaryRequest()
    );
    assert.isDefined(response);
  });

  it("Test getStatistics method with statisticsRequest", async function() {
    const client = new StatisticsClientTest(settings);

    const response = await client.getStatistics(
      new dataServiceRead.StatisticsRequest()
    );
    assert.isDefined(response);
  });
});
