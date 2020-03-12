/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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

import * as dataServiceRead from "../../lib";
import { CoverageApi, LookupApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;

describe("StatistiscClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getDataCoverageSummaryStub: sinon.SinonStub;
    let getStatisticsBitMapStub: sinon.SinonStub;
    let getStatisticsSizeMapStub: sinon.SinonStub;
    let getStatisticsTimeMapStub: sinon.SinonStub;
    let settings: dataServiceRead.OlpClientSettings;
    let getResourceAPIListStub: sinon.SinonStub;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn"
    );
    const mockedLayerId = "mocked-layed-id";
    const headers = new Headers();

    before(() => {
        sandbox = sinon.createSandbox();
        headers.append("cache-control", "max-age=3600");
    });

    beforeEach(() => {
        getDataCoverageSummaryStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageSummary"
        );
        getStatisticsBitMapStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageTile"
        );
        getStatisticsSizeMapStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageSizeMap"
        );
        getStatisticsTimeMapStub = sandbox.stub(
            CoverageApi,
            "getDataCoverageTimeMap"
        );
        getResourceAPIListStub = sandbox.stub(LookupApi, "getResourceAPIList");
        getResourceAPIListStub.callsFake(() =>
            Promise.resolve(
                new Response(
                    JSON.stringify([
                        {
                            api: "statistics",
                            version: "v1",
                            baseURL:
                                "https://query.data.api.platform.here.com/query/v1"
                        },
                        {
                            api: "blob",
                            version: "v1",
                            baseURL:
                                "https://blob.data.api.platform.here.com/blob/v1"
                        },
                        {
                            api: "metadata",
                            version: "v1",
                            baseURL:
                                "https://query.data.api.platform.here.com/metadata/v1"
                        }
                    ]),
                    { headers }
                )
            )
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised with context", async () => {
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);
    });

    it("Should method getSummary provide data", async () => {
        const mockedSummary: CoverageApi.LayerSummary = {
            catalogHRN: "hrn:here:data:::mocked-hrn",
            layer: mockedLayerId,
            levelSummary: {
                "1": {
                    size: 12121122,
                    processedTimestamp: 12312132135,
                    maxPartitionSize: 42,
                    centroid: 4201,
                    totalPartitions: 2000,
                    version: 42,
                    minPartitionSize: 1,
                    boundingBox: {
                        east: 1,
                        north: 2,
                        south: 3,
                        west: 4
                    }
                }
            }
        };
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);
        getDataCoverageSummaryStub.callsFake(
            (builder: any, params: any): Promise<CoverageApi.LayerSummary> => {
                return Promise.resolve(mockedSummary);
            }
        );

        const summaryRequest = new dataServiceRead.SummaryRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId);

        const summary = await statisticsClient.getSummary(summaryRequest);
        assert.isDefined(summary);
    });

    it("Should method getSummary return error if catalogHRN is not provided", async () => {
        const mockedErrorResponse = "No catalogHrn provided";
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);

        const summaryRequest = new dataServiceRead.SummaryRequest().withLayerId(
            mockedLayerId
        );

        const summary = await statisticsClient
            .getSummary(summaryRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getSummary return error if layerId is not provided", async () => {
        const mockedErrorResponse = "No layerId provided";
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);

        const summaryRequest = new dataServiceRead.SummaryRequest().withCatalogHrn(
            mockedHRN
        );

        const summary = await statisticsClient
            .getSummary(summaryRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics provide data", async () => {
        const mockedStatistics: Response = new Response("mocked-response");
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);
        getStatisticsBitMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsSizeMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsTimeMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );

        const statisticBitMapRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withDataLevel(12)
            .withTypemap(dataServiceRead.CoverageDataType.BITMAP);

        const statisticBitMap = await statisticsClient.getStatistics(
            statisticBitMapRequest
        );
        assert.isDefined(statisticBitMap);

        const statisticSizeMapRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withDataLevel(12)
            .withTypemap(dataServiceRead.CoverageDataType.SIZEMAP);

        const statisticSizeMap = await statisticsClient.getStatistics(
            statisticSizeMapRequest
        );
        assert.isDefined(statisticSizeMap);

        const statisticTimeMapRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withDataLevel(12)
            .withTypemap(dataServiceRead.CoverageDataType.TIMEMAP);

        const statisticTimeMap = await statisticsClient.getStatistics(
            statisticTimeMapRequest
        );
        assert.isDefined(statisticTimeMap);
    });

    it("Should method getStatistics return error if catalogHRN is not provided", async () => {
        const mockedErrorResponse = "No catalogHrn provided";
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);

        const statisticRequest = new dataServiceRead.StatisticsRequest()
            .withLayerId(mockedLayerId)
            .withDataLevel(12)
            .withTypemap(dataServiceRead.CoverageDataType.BITMAP);

        const statistic = await statisticsClient
            .getStatistics(statisticRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics return error if layerId is not provided", async () => {
        const mockedErrorResponse = "No layerId provided";
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);

        const statisticRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withDataLevel(12)
            .withTypemap(dataServiceRead.CoverageDataType.BITMAP);

        const statistic = await statisticsClient
            .getStatistics(statisticRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics return error if typemap is not provided", async () => {
        const mockedErrorResponse = "No typemap provided";
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);

        const statisticRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withDataLevel(12);

        const statistic = await statisticsClient
            .getStatistics(statisticRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics provide data if dataLevel not set", async () => {
        const mockedStatistics: Response = new Response("mocked-response");
        const settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        const statisticsClient = new dataServiceRead.StatisticsClient(settings);
        assert.isDefined(statisticsClient);
        getStatisticsBitMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsSizeMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsTimeMapStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );

        const statisticBitMapRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withTypemap(dataServiceRead.CoverageDataType.BITMAP);

        const statisticBitMap = await statisticsClient.getStatistics(
            statisticBitMapRequest
        );
        assert.isDefined(statisticBitMap);

        const statisticSizeMapRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withTypemap(dataServiceRead.CoverageDataType.SIZEMAP);

        const statisticSizeMap = await statisticsClient.getStatistics(
            statisticSizeMapRequest
        );
        assert.isDefined(statisticSizeMap);

        const statisticTimeMapRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withTypemap(dataServiceRead.CoverageDataType.TIMEMAP);

        const statisticTimeMap = await statisticsClient.getStatistics(
            statisticTimeMapRequest
        );
        assert.isDefined(statisticTimeMap);
    });
});
