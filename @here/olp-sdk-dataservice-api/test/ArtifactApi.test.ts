/*
 * Copyright (C) 2020-2022 HERE Europe B.V.
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

import { ArtifactApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("ArtifactApi", function() {
    it("deleteArtifactUsingDELETE", async function() {
        const params = {
            artifactHrn: "mocked-artifactHrn"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/artifact/mocked-artifactHrn"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.deleteArtifactUsingDELETE(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("deleteFileUsingDELETE", async function() {
        const params = {
            artifactHrn: "mocked-artifactHrn",
            fileName: "mocked-fileName"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/artifact/mocked-artifactHrn/mocked-fileName"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.deleteFileUsingDELETE(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getArtifactFileUsingGET", async function() {
        const params = {
            artifactHrn: "mocked-artifactHrn",
            fileName: "mocked-fileName"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/artifact/mocked-artifactHrn/mocked-fileName"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.getArtifactFileUsingGET(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getArtifactUsingGET", async function() {
        const params = {
            artifactHrn: "mocked-artifactHrn",
            fileName: "mocked-fileName"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/mocked-artifactHrn"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.getArtifactUsingGET(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("putArtifactFileUsingPUT", async function() {
        const params = {
            artifactHrn: "mocked-artifactHrn",
            fileName: "mocked-fileName",
            file: "mocked-file"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/artifact/mocked-artifactHrn/mocked-fileName"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.headers["Content-Type"]).equals(
                    "application/json"
                );
                expect(options.body).equals(JSON.stringify("mocked-file"));
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.putArtifactFileUsingPUT(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("registerArtifactUsingPUT", async function() {
        const params = {
            groupId: "mocked-groupId",
            artifactId: "mocked-artifactId",
            registerRequest: "mocked-registerRequest" as any
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/artifact/register/mocked-groupId/mocked-artifactId"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.headers["Content-Type"]).equals(
                    "application/json"
                );
                expect(options.body).equals(
                    JSON.stringify("mocked-registerRequest")
                );
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.registerArtifactUsingPUT(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("deleteSchemaUsingDELETE", async function() {
        const params = {
            schemaHrn: "mocked-schemaHrn"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/schema/mocked-schemaHrn"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.deleteSchemaUsingDELETE(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getDocumentUsingGET", async function() {
        const params = {
            schemaHrn: "mocked-schemaHrn",
            file: "mocked-file"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/schema/mocked-schemaHrn/doc/mocked-file"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.getDocumentUsingGET(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getSchemaUsingGET", async function() {
        const params = {
            schemaHrn: "mocked-schemaHrn"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/schema/mocked-schemaHrn"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.getSchemaUsingGET(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("listUsingGET", async function() {
        const params = {
            sort: "mocked-sort",
            order: "mocked-order" as any,
            from: "mocked-from",
            limit: "mocked-limit" as any
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/schema?sort=mocked-sort&order=mocked-order&from=mocked-from&limit=mocked-limit"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.listUsingGET(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("updateSchemaPermissionUsingPOST", async function() {
        const params = {
            schemaHrn: "mocked-schemaHrn",
            updatePermissionRequest: "mocked-updatePermissionRequest" as any
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/schema/mocked-schemaHrn/permission"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.headers["Content-Type"]).equals(
                    "application/json"
                );
                expect(options.body).equals(
                    JSON.stringify("mocked-updatePermissionRequest")
                );
                return Promise.resolve("success");
            }
        };
        const result = await ArtifactApi.updateSchemaPermissionUsingPOST(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});
