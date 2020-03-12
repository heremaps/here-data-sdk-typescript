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
import { ConfigApi, LookupApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);
const expect = chai.expect;

describe("ConfigClient", () => {
    let sandbox: sinon.SinonSandbox;
    let configClient: dataServiceRead.ConfigClient;
    let getPlatformAPIListStub: sinon.SinonStub;
    let headers: Headers;

    before(() => {
        sandbox = sinon.createSandbox();
        headers = new Headers();
        headers.append("cache-control", "max-age=3600");
        let settings = new dataServiceRead.OlpClientSettings({
            environment: "mocked-env",
            getToken: () => Promise.resolve("mocked-token")
        });
        configClient = new dataServiceRead.ConfigClient(settings);
    });

    beforeEach(() => {
        getPlatformAPIListStub = sandbox.stub(LookupApi, "getPlatformAPIList");
        getPlatformAPIListStub.callsFake(() =>
            Promise.resolve(
                new Response(
                    JSON.stringify([
                        {
                            api: "config",
                            version: "v1",
                            baseURL:
                                "https://config.data.api.platform.here.com/config/v1"
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

    it("Should works as expected with empty request.", async () => {
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

    it("Should works as expected with request with schema and empty billing tag", async () => {
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

    it("Should works as expected with request with schema and with billing tag", async () => {
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
