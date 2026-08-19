/*
 * Copyright (C) 2019-2026 HERE Europe B.V.
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

import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    assert
} from "vitest";
import { createStubInstance } from "./stub-instance";
import * as dataServiceRead from "../../lib";
import { CoverageApi } from "@here/olp-sdk-dataservice-api";
import * as core from "@here/olp-sdk-core";

describe("StatistiscClient", function () {
    let olpClientSettingsStub: any;
    let getDataCoverageSummaryStub: any;
    let getStatisticsBitMapStub: any;
    let getStatisticsSizeMapStub: any;
    let getStatisticsTimeMapStub: any;
    let getBaseUrlRequestStub: any;
    const mockedHRN = core.HRN.fromString("hrn:here:data:::mocked-hrn");
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    beforeAll(function () {});

    beforeEach(function () {
        olpClientSettingsStub = createStubInstance(core.OlpClientSettings);
        getBaseUrlRequestStub = vi
            .spyOn(core.RequestFactory, "getBaseUrl")
            .mockReturnValue(undefined as any);
        getDataCoverageSummaryStub = vi
            .spyOn(CoverageApi, "getDataCoverageSummary")
            .mockReturnValue(undefined as any);
        getStatisticsBitMapStub = vi
            .spyOn(CoverageApi, "getDataCoverageTile")
            .mockReturnValue(undefined as any);
        getStatisticsSizeMapStub = vi
            .spyOn(CoverageApi, "getDataCoverageSizeMap")
            .mockReturnValue(undefined as any);
        getStatisticsTimeMapStub = vi
            .spyOn(CoverageApi, "getDataCoverageTimeMap")
            .mockReturnValue(undefined as any);

        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.resolve(fakeURL)
        );
    });

    afterEach(function () {
        vi.restoreAllMocks();
    });

    it("Shoud be initialised with context", async function () {
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);
    });

    it("Should method getSummary provide data", async function () {
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
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);
        getDataCoverageSummaryStub.mockImplementation(
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

    it("Should method getSummary return error if catalogHRN is not provided", async function () {
        const mockedErrorResponse = "No catalogHrn provided";
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);

        const summaryRequest = new dataServiceRead.SummaryRequest().withLayerId(
            mockedLayerId
        );

        const summary = await statisticsClient
            .getSummary(summaryRequest)
            .catch((error) => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getSummary return error if layerId is not provided", async function () {
        const mockedErrorResponse = "No layerId provided";
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);

        const summaryRequest =
            new dataServiceRead.SummaryRequest().withCatalogHrn(mockedHRN);

        const summary = await statisticsClient
            .getSummary(summaryRequest)
            .catch((error) => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics provide data", async function () {
        const mockedStatistics: Response = new Response("mocked-response");
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);
        getStatisticsBitMapStub.mockImplementation(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsSizeMapStub.mockImplementation(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsTimeMapStub.mockImplementation(
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

    it("Should method getStatistics return error if catalogHRN is not provided", async function () {
        const mockedErrorResponse = "No catalogHrn provided";
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);

        const statisticRequest = new dataServiceRead.StatisticsRequest()
            .withLayerId(mockedLayerId)
            .withDataLevel(12)
            .withTypemap(dataServiceRead.CoverageDataType.BITMAP);

        const statistic = await statisticsClient
            .getStatistics(statisticRequest)
            .catch((error) => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics return error if layerId is not provided", async function () {
        const mockedErrorResponse = "No layerId provided";
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);

        const statisticRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withDataLevel(12)
            .withTypemap(dataServiceRead.CoverageDataType.BITMAP);

        const statistic = await statisticsClient
            .getStatistics(statisticRequest)
            .catch((error) => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics return error if typemap is not provided", async function () {
        const mockedErrorResponse = "No typemap provided";
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);

        const statisticRequest = new dataServiceRead.StatisticsRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId)
            .withDataLevel(12);

        const statistic = await statisticsClient
            .getStatistics(statisticRequest)
            .catch((error) => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.message);
            });
    });

    it("Should method getStatistics provide data if dataLevel not set", async function () {
        const mockedStatistics: Response = new Response("mocked-response");
        const statisticsClient = new dataServiceRead.StatisticsClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(statisticsClient);
        getStatisticsBitMapStub.mockImplementation(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsSizeMapStub.mockImplementation(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedStatistics);
            }
        );
        getStatisticsTimeMapStub.mockImplementation(
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
