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

import { ConfigClient, CatalogsRequest } from "@here/olp-sdk-dataservice-read";
import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
import { ConfigApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ConfigClient", () => {
    let sandbox: sinon.SinonSandbox;

    let getCatalogsConfigStub: any;

    const mockedHRN = "hrn:::test-hrn";

    const fakeURL = "http://fake-base.url";

    class MockedDataStoreContext {
        constructor() {}

        public async getBaseUrl() {
            return Promise.resolve(fakeURL);
        }
    }

    const mockedCatalogsHRN: ConfigApi.CatalogsListResult = {
        results: {
            items: [
                { hrn: "hrn:::test-hrn" },
                { hrn: "hrn:::test-hrn2" },
                { hrn: "hrn:::test-hrn3" }
            ]
        }
    };

    const mockedCatalogsFilteredByHRN: ConfigApi.CatalogsListResult = {
        results: { items: [{ hrn: "hrn:::test-hrn" }] }
    };

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox
            .stub(dataServiceRead, "DataStoreContext")
            .callsFake(() => new MockedDataStoreContext());

        getCatalogsConfigStub = sandbox.stub(ConfigApi, "getCatalogs");

        getCatalogsConfigStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ConfigApi.CatalogsListResult> => {
                if (params.schemaHrn) {
                    return Promise.resolve(mockedCatalogsFilteredByHRN);
                }
                return Promise.resolve(mockedCatalogsHRN);
            }
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialized with context", async () => {
        const context = new MockedDataStoreContext();
        const configClient = new ConfigClient(
            (context as unknown) as dataServiceRead.DataStoreContext
        );
        assert.isDefined(configClient);
    });

    it("Should return all catalogs provided filtered by schema HRN.", async () => {
        const context = new MockedDataStoreContext();
        const configClient = new ConfigClient(
            (context as unknown) as dataServiceRead.DataStoreContext
        );

        const CatalogsConfigRequest = new CatalogsRequest().withSchema(
            mockedHRN
        );
        const getCatalogsResponse = (await configClient.getCatalogs(
            CatalogsConfigRequest
        )) as any;

        assert.isDefined(getCatalogsResponse);
        expect(getCatalogsResponse.results.items[0].hrn).to.be.equal(
            "hrn:::test-hrn"
        );
        expect(getCatalogsResponse.results.items[1]).to.be.undefined;
    });

    it("Should return all catalogs provided without setted filter by schema HRN.", async () => {
        const context = new MockedDataStoreContext();
        const configClient = new ConfigClient(
            (context as unknown) as dataServiceRead.DataStoreContext
        );

        const CatalogsConfigRequest = new CatalogsRequest();
        const getCatalogsResponse = (await configClient.getCatalogs(
            CatalogsConfigRequest
        )) as any;

        assert.isDefined(getCatalogsResponse);
        expect(getCatalogsResponse.results.items[0].hrn).to.be.equal(
            "hrn:::test-hrn"
        );
        expect(getCatalogsResponse.results.items[1].hrn).to.be.equal(
            "hrn:::test-hrn2"
        );
        expect(getCatalogsResponse.results.items[2].hrn).to.be.equal(
            "hrn:::test-hrn3"
        );
    });
});
