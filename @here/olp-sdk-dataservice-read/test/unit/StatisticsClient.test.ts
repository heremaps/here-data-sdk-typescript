/*
 * Copyright (C) 2019 HERE Europe B.V.
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

import { StatisticsClient, SummaryRequest } from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import { CoverageApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StatistiscClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getDataCoverageSummaryStub: any;
    const mockedHRN = "hrn:::mocked-hrn";
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    class MockedDataStoreContext {
        constructor() {}

        public async getBaseUrl() {
            return Promise.resolve(fakeURL);
        }
    }

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox
            .stub(dataServiceRead, "DataStoreContext")
            .callsFake(() => new MockedDataStoreContext());
        getDataCoverageSummaryStub = sandbox.stub(CoverageApi, "getDataCoverageSummary");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised with context", async () => {
        const context = new MockedDataStoreContext();
        const statisticsClient = new StatisticsClient(
            (context as unknown) as dataServiceRead.DataStoreContext
        );
        assert.isDefined(statisticsClient);
    });

    it("Should method getSummary provide data", async () => {
        const mockedSummary: CoverageApi.LayerSummary = {
            catalogHRN: mockedHRN,
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
        const context = new MockedDataStoreContext();
        const statisticsClient = new StatisticsClient(
            (context as unknown) as dataServiceRead.DataStoreContext
        );
        assert.isDefined(statisticsClient);
        getDataCoverageSummaryStub.callsFake((builder: any, params: any): Promise<CoverageApi.LayerSummary> => {
            return Promise.resolve(mockedSummary);
        });

        const summaryRequest = new SummaryRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId);

        const summary = await statisticsClient.getSummary(summaryRequest);
        assert.isDefined(summary);
    });
});
