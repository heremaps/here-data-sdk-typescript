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

import { IndexApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("IndexApi", function() {
    it("Should performQuery provide data", async function() {
        const mockedResponse = {
            data: [
                {
                    size: 100500,
                    id: "2374232432DJSFF4353VD.11"
                },
                {
                    size: 100500,
                    id: "2374232432DJSFF4353VD.11"
                }
            ]
        };
        const params = {
            layerID: "mocked-id",
            query: "hour_from>0",
            huge: true
        };
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id?huge=true&query=hour_from%3E0"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve(mockedResponse);
            }
        };
        const response = await IndexApi.performQuery(
            (builder as unknown) as RequestBuilder,
            params
        );
        assert.isDefined(response.data);
        assert.equal(response.data && response.data.length, 2);
        expect(response).to.be.equal(mockedResponse);
    });
});
