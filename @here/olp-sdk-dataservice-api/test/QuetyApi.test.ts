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

import { QueryApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("QueryApi", function() {
    it("getChangesById", async function() {
        const params = {
            layerId: "mocked-layerId",
            startVersion: "mocked-startVersion",
            endVersion: "mocked-endVersion",
            sinceTime: "mocked-sinceTime" as any,
            additionalFields: "mocked-additionalFields" as any,
            partition: "mocked-partition" as any,
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-layerId/changes?startVersion=mocked-startVersion&endVersion=mocked-endVersion&sinceTime=mocked-sinceTime&additionalFields=mocked-additionalFields&partition=mocked-partition&billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await QueryApi.getChangesById(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getPartitionsById", async function() {
        const params = {
            layerId: "mocked-layerId",
            partition: ["mocked-partition-1", "mocked-partition-2"],
            version: "mocked-version",
            additionalFields: "mocked-additionalFields" as any,
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-layerId/partitions?partition=mocked-partition-1&partition=mocked-partition-2&version=mocked-version&additionalFields=mocked-additionalFields&billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await QueryApi.getPartitionsById(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("quadTreeIndex", async function() {
        const params = {
            layerId: "mocked-layerId",
            version: 124,
            quadKey: "mocked-quadKey",
            depth: 12,
            additionalFields: [
                "mocked-additionalField-1",
                "mocked-additionalField-2"
            ],
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-layerId/versions/124/quadkeys/mocked-quadKey/depths/12?additionalFields=mocked-additionalField-1,mocked-additionalField-2&billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await QueryApi.quadTreeIndex(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("quadTreeIndexVolatile", async function() {
        const params = {
            layerId: "mocked-layerId",
            quadKey: "mocked-quadKey",
            depth: 12,
            additionalFields: [
                "mocked-additionalField-1",
                "mocked-additionalField-2"
            ],
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-layerId/quadkeys/mocked-quadKey/depths/12?additionalFields=mocked-additionalField-1,mocked-additionalField-2&billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await QueryApi.quadTreeIndexVolatile(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});
