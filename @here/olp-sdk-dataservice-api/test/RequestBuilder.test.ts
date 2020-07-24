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
import { UrlBuilder } from "../index";

const assert = chai.assert;
const expect = chai.expect;

describe("UrlBuilderTest", function() {
    const testUrlBuilder = new UrlBuilder("test-url");

    it("UrlBuilder shoud be initialized", async function() {
        assert.isDefined(testUrlBuilder);
        expect(testUrlBuilder).to.be.instanceOf(UrlBuilder);
    });

    it("Method stringifyQuery should return URL query string from a key, value paris provided as params.", async function() {
        const mockedUrlQueryResult = "testKey=testValuetestKey2=testValue2";

        const urlQueryResult = UrlBuilder.stringifyQuery({
            testKey: "testValue",
            testKey2: "testValue2"
        });
        expect(urlQueryResult).to.be.equal(mockedUrlQueryResult);
    });

    it("Method appendQuery should appends parameters key, value to the URL.", async function() {
        const mockedUrl = "test-url?testKey=testValue";

        testUrlBuilder.appendQuery("testKey", "testValue");

        assert.isDefined(testUrlBuilder);
        expect(testUrlBuilder.url).to.be.equal(mockedUrl);
        expect(testUrlBuilder.hasQuery).to.be.equal(true);
    });

    it("Method appendQuery should not appends parameters to the URL if value is undefined.", async function() {
        const testUrlBuilder2 = new UrlBuilder("test-url");
        const mockedUrl = "test-url";

        testUrlBuilder2.appendQuery("testKey");

        assert.isDefined(testUrlBuilder2);

        expect(testUrlBuilder2.url).to.be.equal(mockedUrl);
        expect(testUrlBuilder2.hasQuery).to.be.equal(false);
    });

    it("Method appendQuery should appends parameters key, value to the URL, when parameter value type is number", async function() {
        const testUrlBuilder3 = new UrlBuilder("test-url");
        const mockedValue = 33;
        const mockedUrl = "test-url?testKey3=33";

        testUrlBuilder3.appendQuery("testKey3", mockedValue);

        assert.isDefined(testUrlBuilder3);

        expect(testUrlBuilder3.url).to.be.equal(mockedUrl);
        expect(testUrlBuilder3.hasQuery).to.be.equal(true);
    });

    it("Method appendQuery should appends parameters key, value to the URL, when parameter value is an array of strings", async function() {
        const testUrlBuilder4 = new UrlBuilder("test-url");
        const mockedUrl = "test-url?testkey=value1,value2,value3";

        testUrlBuilder4.appendQuery("testkey", ["value1", "value2", "value3"]);

        assert.isDefined(testUrlBuilder4);
        expect(testUrlBuilder4.url).to.be.equal(mockedUrl);
        expect(testUrlBuilder4.hasQuery).to.be.equal(true);
    });
});
