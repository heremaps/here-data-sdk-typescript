/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
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

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import {
  StatisticsClient,
  SummaryRequest,
  StatisticsRequest,
  CoverageDataType
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "../FetchMock";
import * as core from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StatisticsClient", function() {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;

  let statisticsClient: StatisticsClient;
  let settings: core.OlpClientSettings;

  const mockedHRN = core.HRN.fromString("hrn:here:data:::mocked-hrn");
  const mockedLayerId = "mocked-layed-id";

  before(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(function() {
    fetchMock = new FetchMock();
    fetchStub = sandbox.stub(global as any, "fetch");
    fetchStub.callsFake(fetchMock.fetch());

    // Setup Statistics Client with new OlpClientSettings.
    settings = new core.OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    statisticsClient = new StatisticsClient(settings);
  });

  it("Shoud be initialized with settings", async function() {
    assert.isDefined(statisticsClient);
    expect(statisticsClient).to.be.instanceOf(StatisticsClient);
  });

  it("Should fetch the summary info from statistics service", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "statistics",
            version: "v1",
            baseURL:
              "https://statistics.data.api.platform.here.com/statistics/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ])
      )
    );

    // Set the response from Statistics service with the summary info.
    const mockedStatisticsSummary = {
      catalogHRN: "hrn:here-dev:data:::samplecatalog",
      layer: "sampleLayer",
      levelSummary: [
        {
          summaryPerZoomLevel: {
            size: 1024,
            proccessedTimestamp: 1567116347,
            centroid: 1256044,
            totalPartitions: 2500,
            bbox: {
              east: "41.8785",
              north: "41.8781",
              south: "87.6278",
              west: "87.6298"
            },
            minPartitionSize: 512,
            maxPartitionSize: 1024,
            version: 3
          },
          version: 11
        }
      ]
    };

    mockedResponses.set(
      `https://statistics.data.api.platform.here.com/statistics/v1/layers/mocked-layed-id/summary`,
      new Response(JSON.stringify(mockedStatisticsSummary))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const summaryRequest = new SummaryRequest()
      .withCatalogHrn(mockedHRN)
      .withLayerId(mockedLayerId);

    const summaryResponse = await statisticsClient.getSummary(summaryRequest);
    assert.isDefined(summaryResponse);

    expect(summaryResponse.catalogHRN).to.be.equal(
      "hrn:here-dev:data:::samplecatalog"
    );
    expect(summaryResponse.layer).to.be.equal("sampleLayer");
    assert.isDefined(summaryResponse.levelSummary);

    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should method getSummary return error if catalogHRN is not provided", async function() {
    const mockedErrorResponse = "No catalogHrn provided";

    const summaryRequest = new SummaryRequest().withLayerId(mockedLayerId);

    const summaryResponse = await statisticsClient
      .getSummary(summaryRequest)
      .catch(error => {
        assert.isDefined(error);
        assert.equal(mockedErrorResponse, error.message);
      });
  });

  it("Should method getSummary return error if layerId is not provided", async function() {
    const mockedErrorResponse = "No layerId provided";

    const summaryRequest = new SummaryRequest().withCatalogHrn(mockedHRN);

    const summaryResponse = await statisticsClient
      .getSummary(summaryRequest)
      .catch(error => {
        assert.isDefined(error);
        assert.equal(mockedErrorResponse, error.message);
      });
  });

  it("Should method getStatistics return timemap statistics data", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "statistics",
            version: "v1",
            baseURL:
              "https://statistics.data.api.platform.here.com/statistics/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ])
      )
    );

    // Set the response from Statistics service with the statistics info.
    const mockedData = Buffer.alloc(42);

    mockedResponses.set(
      `https://statistics.data.api.platform.here.com/statistics/v1/layers/mocked-layed-id/heatmap/age?datalevel=3&catalogHRN=hrn%3Ahere%3Adata%3A%3A%3Amocked-hrn`,
      new Response(JSON.stringify(mockedData))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const statisticsRequest = new StatisticsRequest()
      .withCatalogHrn(mockedHRN)
      .withLayerId(mockedLayerId)
      .withDataLevel(3)
      .withTypemap(CoverageDataType.TIMEMAP);

    const summaryResponse = await statisticsClient.getStatistics(
      statisticsRequest
    );
    assert.isDefined(summaryResponse);
    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should method getStatistics return sizemap statistics data", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "statistics",
            version: "v1",
            baseURL:
              "https://statistics.data.api.platform.here.com/statistics/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ])
      )
    );

    // Set the response from Statistics service with the statistics info.
    const mockedData = Buffer.alloc(42);

    mockedResponses.set(
      `https://statistics.data.api.platform.here.com/statistics/v1/layers/mocked-layed-id/heatmap/size?datalevel=3`,
      new Response(JSON.stringify(mockedData))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const statisticsRequest = new StatisticsRequest()
      .withCatalogHrn(mockedHRN)
      .withLayerId(mockedLayerId)
      .withDataLevel(3)
      .withTypemap(CoverageDataType.SIZEMAP);

    const summaryResponse = await statisticsClient.getStatistics(
      statisticsRequest
    );
    assert.isDefined(summaryResponse);
    expect(fetchStub.callCount).to.be.equal(2);
  });

  it("Should method getStatistics return bitmap statistics data", async function() {
    const mockedResponses = new Map();

    // Set the response from lookup api
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "statistics",
            version: "v1",
            baseURL:
              "https://statistics.data.api.platform.here.com/statistics/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ])
      )
    );

    // Set the response from Statistics service with the statistics info.
    const mockedData = Buffer.alloc(42);

    mockedResponses.set(
      `https://statistics.data.api.platform.here.com/statistics/v1/layers/mocked-layed-id/tilemap?datalevel=3`,
      new Response(JSON.stringify(mockedData))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const statisticsRequest = new StatisticsRequest()
      .withCatalogHrn(mockedHRN)
      .withLayerId(mockedLayerId)
      .withDataLevel(3)
      .withTypemap(CoverageDataType.BITMAP);

    const summaryResponse = await statisticsClient.getStatistics(
      statisticsRequest
    );
    assert.isDefined(summaryResponse);
    expect(fetchStub.callCount).to.be.equal(2);
  });
});
