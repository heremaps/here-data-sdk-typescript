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

import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("ConfigApi", () => {
    it("catalogExists", async () => {
        const params = {
            catalogHrn: "mocked-catalogHrn",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs/mocked-catalogHrn?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("HEAD");
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.catalogExists(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("createCatalog", async () => {
        const params = {
            body: "mocked-body" as any,
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).equals(JSON.stringify("mocked-body"));
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.createCatalog(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("deleteCatalog", async () => {
        const params = {
            catalogHrn: "mocked-catalogHrn",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs/mocked-catalogHrn?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.deleteCatalog(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("deleteLayer", async () => {
        const params = {
            catalogHrn: "mocked-catalogHrn",
            layerId: "mocked-layerId"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs/mocked-catalogHrn/layers/mocked-layerId"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.deleteLayer(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getCatalog", async () => {
        const params = {
            catalogHrn: "mocked-catalogHrn",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs/mocked-catalogHrn?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.getCatalog(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getCatalogStatus", async () => {
        const params = {
            token: "mocked-token",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/status/mocked-token?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.getCatalogStatus(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getCatalogs", async () => {
        const params = {
            billingTag: "mocked-billingTag" as any,
            verbose: "mocked-verbose" as any,
            q: "mocked-verbose" as any,
            organisation: "mocked-organisation" as any,
            organisationType: "mocked-organisationType" as any,
            layerType: "mocked-layerType" as any,
            region: "mocked-region" as any,
            schemaHrn: "mocked-schemaHrn" as any,
            resourceType: "mocked-resourceType" as any,
            coverage: "mocked-coverage" as any,
            access: "mocked-access" as any,
            limit: "mocked-limit" as any,
            sortBy: "mocked-sortBy" as any,
            sortOrder: "mocked-sortOrder" as any
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs?billingTag=mocked-billingTag&verbose=mocked-verbose&q=mocked-verbose&organisation=mocked-organisation&organisationType=mocked-organisationType&layerType=mocked-layerType&region=mocked-region&schemaHrn=mocked-schemaHrn&resourceType=mocked-resourceType&coverage=mocked-coverage&access=mocked-access&limit=mocked-limit&sortBy=mocked-sortBy&sortOrder=mocked-sortOrder"
                );
                expect(options.method).to.be.equal("GET");

                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.getCatalogs(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("patchCatalog", async () => {
        const params = {
            catalogHrn: "mocked-catalogHrn",
            body: "mocked-body" as any
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs/mocked-catalogHrn"
                );
                expect(options.method).to.be.equal("PATCH");
                expect(options.headers["Content-Type"]).equals(
                    "application/json"
                );
                expect(options.body).equals(JSON.stringify("mocked-body"));
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.patchCatalog(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("patchLayer", async () => {
        const params = {
            catalogHrn: "mocked-catalogHrn",
            layerId: "mocked-layerId",
            body: "mocked-body" as any
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs/mocked-catalogHrn/layers/mocked-layerId"
                );
                expect(options.method).to.be.equal("PATCH");
                expect(options.headers["Content-Type"]).equals(
                    "application/json"
                );
                expect(options.body).equals(JSON.stringify("mocked-body"));
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.patchLayer(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("updateCatalog", async () => {
        const params = {
            catalogHrn: "mocked-catalogHrn",
            body: "mocked-body" as any,
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/catalogs/mocked-catalogHrn?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.headers["Content-Type"]).equals(
                    "application/json"
                );
                expect(options.body).equals(JSON.stringify("mocked-body"));
                return Promise.resolve("success");
            }
        };
        const result = await ConfigApi.updateCatalog(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});
