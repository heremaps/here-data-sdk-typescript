/*
 * Copyright (C) 2021 HERE Europe B.V.
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

import { ObjectStoreApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ObjectStoreApi", function() {
    it("cancelMultipartUploadByKey", async function() {
        const params = {
            layerId: "mocked-id",
            multipartToken: "mocked-multiPartToken"
        } as any;
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keysMultipart/mocked-multiPartToken"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.cancelMultipartUploadByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("checkKeyExists", async function() {
        const params = {
            layerId: "mocked-id",
            key: "mocked-key"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keys/mocked-key"
                );
                expect(options.method).to.be.equal("HEAD");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.checkKeyExists(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("completeMultipartUploadByKey", async function() {
        const params = {
            layerId: "mocked-id",
            multipartToken: "mocked-multiPartToken"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keysMultipart/mocked-multiPartToken"
                );
                expect(options.method).to.be.equal("PUT");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.completeMultipartUploadByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("deleteBlobByKey", async function() {
        const params = {
            layerId: "mocked-id",
            key: "mocked-key"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keys/mocked-key"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.deleteBlobByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getBlobByKey", async function() {
        const params = {
            layerId: "mocked-id",
            key: "mocked-key"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keys/mocked-key"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.getBlobByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getMultipartUploadStatusByKey", async function() {
        const params = {
            layerId: "mocked-id",
            multipartToken: "mocked-multiPartToken"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keysMultipart/mocked-multiPartToken"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.getMultipartUploadStatusByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("listKeys", async function() {
        const params = {
            layerId: "mocked-id"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keys"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.listKeys(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("putBlobByKey", async function() {
        const params = {
            layerId: "mocked-id",
            key: "mocked-key",
            body: "mocked-body",
            contentLength: 5
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keys/mocked-key"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.body).equals(JSON.stringify("mocked-body"));
                expect(options.headers["Content-Length"]).equals("5");
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.putBlobByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("startMultipartUploadByKey", async function() {
        const params = {
            layerId: "mocked-id",
            key: "mocked-key",
            body: {
                contentType: "application/json"
            }
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keys/mocked-key"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).equals(
                    JSON.stringify({
                        contentType: "application/json"
                    })
                );
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.startMultipartUploadByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("uploadPartByKey", async function() {
        const params = {
            layerId: "mocked-id",
            body: "mocked-body",
            multipartToken: "mocked-multiPartToken",
            partNumber: 2
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/keysMultipart/mocked-multiPartToken/parts?partNumber=2"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).equals(JSON.stringify("mocked-body"));
                return Promise.resolve("success");
            }
        };
        const result = await ObjectStoreApi.uploadPartByKey(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});
