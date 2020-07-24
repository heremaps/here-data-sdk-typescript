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
import * as dataServiceRead from "../../lib";
import { ConfigApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);
const expect = chai.expect;

let sandbox: sinon.SinonSandbox;
const settings = {} as any;
const configClient = new dataServiceRead.ConfigClient(settings);

describe("ConfigClient", function() {
    before(function() {
        sandbox = sinon.createSandbox();
    });

    beforeEach(function() {
        sandbox
            .stub(dataServiceRead.RequestFactory, "create")
            .callsFake(() => Promise.resolve({} as any));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("Should works as expected with empty request.", async function() {
        class MockedCatalogsRequest {
            public getSchema() {
                return undefined;
            }
            public getBillingTag() {
                return undefined;
            }
        }

        sandbox.stub(ConfigApi, "getCatalogs").callsFake((_, params): any => {
            expect(params.billingTag === undefined).to.be.true;
            return Promise.resolve();
        });

        const catalogsConfigRequest = new MockedCatalogsRequest();
        await configClient.getCatalogs(catalogsConfigRequest as any);
    });

    it("Should works as expected with request with schema and empty billing tag", async function() {
        class MockedCatalogsRequest {
            public getSchema() {
                return "test-schema-string";
            }
            public getBillingTag() {
                return undefined;
            }
        }

        sandbox.stub(ConfigApi, "getCatalogs").callsFake((_, params): any => {
            expect(params.billingTag === undefined).to.be.true;
            expect(params.schemaHrn === "test-schema-string").to.be.true;
            expect(params.verbose === "true").to.be.true;
            return Promise.resolve();
        });

        const catalogsConfigRequest = new MockedCatalogsRequest();
        await configClient.getCatalogs(catalogsConfigRequest as any);
    });

    it("Should works as expected with request with schema and with billing tag", async function() {
        class MockedCatalogsRequest {
            public getSchema() {
                return "test-schema-string";
            }
            public getBillingTag() {
                return "test-billing-tag";
            }
        }

        sandbox.stub(ConfigApi, "getCatalogs").callsFake((_, params): any => {
            expect(params.verbose === "true").to.be.true;
            expect(params.schemaHrn === "test-schema-string").to.be.true;
            expect(params.billingTag === "test-billing-tag").to.be.true;
            return Promise.resolve();
        });

        const catalogsConfigRequest = new MockedCatalogsRequest();
        await configClient.getCatalogs(catalogsConfigRequest as any);
    });
});
