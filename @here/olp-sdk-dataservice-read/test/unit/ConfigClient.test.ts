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
import * as dataServiceRead from "../../lib";
import { RequestFactory } from "@here/olp-sdk-core";
import { ConfigApi } from "@here/olp-sdk-dataservice-api";

const settings = {} as any;
const configClient = new dataServiceRead.ConfigClient(settings);

describe("ConfigClient", function () {
    beforeAll(function () {});

    beforeEach(function () {
        vi.spyOn(RequestFactory, "create").mockImplementation(() =>
            Promise.resolve({} as any)
        );
    });

    afterEach(function () {
        vi.restoreAllMocks();
    });

    it("Should works as expected with empty request.", async function () {
        class MockedCatalogsRequest {
            public getSchema() {
                return undefined;
            }
            public getBillingTag() {
                return undefined;
            }
        }

        vi.spyOn(ConfigApi, "getCatalogs").mockImplementation(
            (_, params): any => {
                expect(params.billingTag === undefined).to.be.true;
                return Promise.resolve();
            }
        );

        const catalogsConfigRequest = new MockedCatalogsRequest();
        await configClient.getCatalogs(catalogsConfigRequest as any);
    });

    it("Should works as expected with request with schema and empty billing tag", async function () {
        class MockedCatalogsRequest {
            public getSchema() {
                return "test-schema-string";
            }
            public getBillingTag() {
                return undefined;
            }
        }

        vi.spyOn(ConfigApi, "getCatalogs").mockImplementation(
            (_, params): any => {
                expect(params.billingTag === undefined).to.be.true;
                expect(params.schemaHrn === "test-schema-string").to.be.true;
                expect(params.verbose === "true").to.be.true;
                return Promise.resolve();
            }
        );

        const catalogsConfigRequest = new MockedCatalogsRequest();
        await configClient.getCatalogs(catalogsConfigRequest as any);
    });

    it("Should works as expected with request with schema and with billing tag", async function () {
        class MockedCatalogsRequest {
            public getSchema() {
                return "test-schema-string";
            }
            public getBillingTag() {
                return "test-billing-tag";
            }
        }

        vi.spyOn(ConfigApi, "getCatalogs").mockImplementation(
            (_, params): any => {
                expect(params.verbose === "true").to.be.true;
                expect(params.schemaHrn === "test-schema-string").to.be.true;
                expect(params.billingTag === "test-billing-tag").to.be.true;
                return Promise.resolve();
            }
        );

        const catalogsConfigRequest = new MockedCatalogsRequest();
        await configClient.getCatalogs(catalogsConfigRequest as any);
    });
});
