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

import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { LookupApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("lookupAPI", () => {
    it("platformAPI", async () => {
        const params = {
            api: "mocked-api",
            version: "mocked-version"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/platform/apis/mocked-api/mocked-version"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await LookupApi.platformAPI(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("platformAPIList", async () => {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/platform/apis"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await LookupApi.platformAPIList(
            (builder as unknown) as RequestBuilder
        );

        expect(result).to.be.equal("success");
    });

    it("resourceAPI", async () => {
        const params = {
            hrn: "mocked-hrn",
            api: "mocked-api",
            version: "mocked-version",
            region: "mocked-region"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-hrn/apis/mocked-api/mocked-version?region=mocked-region"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await LookupApi.resourceAPI(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("resourceAPIList", async () => {
        const params = {
            hrn: "mocked-hrn",
            region: "mocked-region"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/resources/mocked-hrn/apis?region=mocked-region"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await LookupApi.resourceAPIList(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});
