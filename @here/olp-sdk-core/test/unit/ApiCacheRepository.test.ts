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

import * as lib from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ApiCacheRepository", () => {
    let testCache = new lib.KeyValueCache();
    testCache.put("test-key", "test-value");
    let apiCacheRepository = new lib.ApiCacheRepository(testCache);

    const testServiceApiName = "config";
    const testServiceVersion = "service-version";
    const testServiceUrl = "service-url";

    const testServiceApiName2 = "metadata";
    const testServiceVersion2 = "service-version2";
    const testServiceUrl2 = "service-url2";

    const testServiceApiName3 = "query";
    const testServiceVersion3 = "service-version3";
    const testServiceUrl3 = "service-url3";

    it("Shoud be initialised", async () => {
        assert.isDefined(apiCacheRepository);
        expect(apiCacheRepository).be.instanceOf(lib.ApiCacheRepository);
    });

    it("Method put should store a new key-value pair in the cache", async () => {
        const operationIsSuccessful = apiCacheRepository.put(
            testServiceApiName,
            testServiceVersion,
            testServiceUrl,
            "api"
        );

        expect(operationIsSuccessful).equal(true);
        expect(
            apiCacheRepository.get(
                testServiceApiName,
                testServiceVersion,
                "api"
            )
        ).equal(testServiceUrl);
    });

    it("Method get should return the base URL from the cache.", async () => {
        apiCacheRepository.put(
            testServiceApiName2,
            testServiceVersion2,
            testServiceUrl2,
            "api"
        );
        apiCacheRepository.put(
            testServiceApiName3,
            testServiceVersion3,
            testServiceUrl3,
            "api"
        );

        expect(
            apiCacheRepository.get(
                testServiceApiName,
                testServiceVersion,
                "api"
            )
        ).equal(testServiceUrl);
        expect(
            apiCacheRepository.get(
                testServiceApiName2,
                testServiceVersion2,
                "api"
            )
        ).equal(testServiceUrl2);
        expect(
            apiCacheRepository.get(
                testServiceApiName3,
                testServiceVersion3,
                "api"
            )
        ).equal(testServiceUrl3);
    });
});
