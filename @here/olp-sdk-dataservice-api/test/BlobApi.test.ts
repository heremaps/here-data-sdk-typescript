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

import { BlobApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("BlobApi", function() {
    it("cancelMultipartUpload", async function() {
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            multiPartToken: "mocked-multiPartToken",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle/multiparts/mocked-multiPartToken?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.cancelMultipartUpload(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("checkBlobExistsStatus", async function() {
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("HEAD");
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.checkBlobExistsStatus(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("doCompleteMultipartUpload", async function() {
        const params = {
            url:
                "http://mocked.url/layers/mocked-id/data/mocked-datahandle/multiparts/mocked-multiPartToken",
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            multiPartToken: "mocked-multiPartToken",
            contentType: "text/plain",
            parts: {
                parts: [{ etag: "mocked-etag", number: 123 }]
            },
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle/multiparts/mocked-multiPartToken?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.body).to.be.equal(
                    JSON.stringify({
                        parts: [{ etag: "mocked-etag", number: 123 }]
                    })
                );
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.doCompleteMultipartUpload(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("deleteBlob", async function() {
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            billingTag: "mocked-billingTag"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.deleteBlob(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getBlob", async function() {
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            billingTag: "mocked-billingTag",
            range: "mocked-range"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                expect(options.headers.Range).equals("mocked-range");
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.getBlob(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getMultipartUploadStatus", async function() {
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            billingTag: "mocked-billingTag",
            multiPartToken: "mocked-multiPartToken"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle/multiparts/mocked-multiPartToken?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.getMultipartUploadStatus(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("putData", async function() {
        const content = Buffer.from("mocked-data", "utf8");
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            billingTag: "mocked-billingTag",
            body: content,
            contentLength: 11,
            contentType: "text/plain",
            contentEncoding: "mocked-contentEncoding"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.body).equals(content);
                // tslint:disable-next-line: no-magic-numbers
                expect(options.headers["Content-Length"]).equals(11);
                expect(options.headers["Content-Type"]).equals("text/plain");
                expect(options.headers["Content-Encoding"]).equals(
                    "mocked-contentEncoding"
                );
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.putData(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("startMultipartUpload", async function() {
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            billingTag: "mocked-billingTag",
            body: "mocked-body" as any
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle/multiparts?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("POST");
                expect(options.body).equals(JSON.stringify("mocked-body"));
                return Promise.resolve("success");
            }
        };
        const result = await BlobApi.startMultipartUpload(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});

it("doUploadPart", async function() {
    const params = {
        url:
            "http://mocked.url/layers/mocked-id/data/mocked-datahandle/multiparts/mocked-multiPartToken/parts",
        layerId: "mocked-id",
        dataHandle: "mocked-datahandle",
        billingTag: "mocked-billingTag",
        body: "mocked-data",
        multiPartToken: "mocked-multiPartToken",
        partNumber: 3,
        contentType: "mocked-contentType",
        contentLength: 11
    } as any;
    const builder = {
        baseUrl: "http://mocked.url",
        requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
            expect(urlBuilder.url).to.be.equal(
                "http://mocked.url/layers/mocked-id/data/mocked-datahandle/multiparts/mocked-multiPartToken/parts?partNumber=3&billingTag=mocked-billingTag"
            );
            expect(options.method).to.be.equal("POST");
            expect(options.headers["Content-Type"]).equals(
                "mocked-contentType"
            );
            return Promise.resolve("success");
        }
    };
    const result = await BlobApi.doUploadPart(
        (builder as unknown) as RequestBuilder,
        params
    );

    expect(result).to.be.equal("success");
});
