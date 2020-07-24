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

import { PublishApi } from "@here/olp-sdk-dataservice-api";

import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("PublishApi", function() {
    it("getPublication", async function() {
        const params = {
            publicationId: "mocked-publicationId",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/publications/mocked-publicationId?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await PublishApi.getPublication(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("initPublication", async function() {
        const params = {
            publicationId: "mocked-publicationId",
            body: {
                id: "mocked-publication-id",
                layerIds: ["layer-0", "layer-1"],
                catalogVersion: -1
            },
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/publications?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.headers["Content-Type"]).to.be.equal(
                    "application/json"
                );
                expect(options.body).to.be.equal(
                    // tslint:disable-next-line: quotemark
                    '{"id":"mocked-publication-id","layerIds":["layer-0","layer-1"],"catalogVersion":-1}'
                );
                return Promise.resolve("success");
            }
        };
        const result = await PublishApi.initPublication(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("submitPublication", async function() {
        const params = {
            publicationId: "mocked-publicationId",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (
                urlBuilder: UrlBuilder,
                options: RequestInit
            ) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/publications/mocked-publicationId?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("PUT");
                return Promise.resolve("success");
            }
        };
        const result = await PublishApi.submitPublication(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("uploadPartitions", async function() {
        const params = {
            layerId: "mocked-layer-id",
            publicationId: "mocked-publicationId",
            body: {
                partitions: [
                    { partition: "mocked-partition-1" },
                    { partition: "mocked-partition-2" }
                ]
            },
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-layer-id/publications/mocked-publicationId/partitions?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("POST");

                expect(options.headers["Content-Type"]).to.be.equal(
                    "application/json"
                );
                expect(options.body).to.be.equal(
                    // tslint:disable-next-line: quotemark
                    '{"partitions":[{"partition":"mocked-partition-1"},{"partition":"mocked-partition-2"}]}'
                );

                return Promise.resolve("success");
            }
        };
        const result = await PublishApi.uploadPartitions(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("cancelPublication", async function() {
        const params = {
            publicationId: "mocked-publicationId",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: RequestInit) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/publications/mocked-publicationId?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await PublishApi.cancelPublication(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});
