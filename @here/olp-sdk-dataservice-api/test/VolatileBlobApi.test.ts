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

import { VolatileBlobApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VolatileBlobApi", () => {
    it("checkHandleExists", async () => {
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
                expect(options.method).to.be.equal("HEAD");
                return Promise.resolve("success");
            }
        };
        const result = await VolatileBlobApi.checkHandleExists(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("deleteVolatileBlob", async () => {
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
        const result = await VolatileBlobApi.deleteVolatileBlob(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("getVolatileBlob", async () => {
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
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        };
        const result = await VolatileBlobApi.getVolatileBlob(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });

    it("putVolatileBlob", async () => {
        const params = {
            layerId: "mocked-id",
            dataHandle: "mocked-datahandle",
            billingTag: "mocked-billingTag",
            body: "mocked-body"
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/data/mocked-datahandle?billingTag=mocked-billingTag"
                );
                expect(options.method).to.be.equal("PUT");
                expect(options.body).equals(JSON.stringify("mocked-body"));
                return Promise.resolve("success");
            }
        };
        const result = await VolatileBlobApi.putVolatileBlob(
            (builder as unknown) as RequestBuilder,
            params
        );

        expect(result).to.be.equal("success");
    });
});
