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

import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import { KeyValueCache } from "@here/olp-sdk-core";

chai.use(sinonChai);
const expect = chai.expect;

describe("KeyValueCache", () => {
    let sandbox: sinon.SinonSandbox;
    let keyValueCache1 = new KeyValueCache();

    beforeEach(() => {
        keyValueCache1.put("key1", "value1");
        keyValueCache1.put("key2", "value2");
    });

    it("Should put new key value", () => {
        keyValueCache1.put("key3", "value3");

        expect(keyValueCache1.get("key1")).equal("value1");
        expect(keyValueCache1.get("key2")).equal("value2");
        expect(keyValueCache1.get("key3")).equal("value3");
    });

    it("Should put handle error", () => {
        const cache = new KeyValueCache();
        const resp1 = cache.put("key", "somedata");
        expect(resp1).equal(true);
        cache.setCapacity(0.00000001);
        const resp2 = cache.put("key", "value");
        expect(resp2).equal(false);
    });

    it("Should getCapacity return cache capacity", () => {
        const cache = new KeyValueCache();
        expect(cache.getCapacity()).equal(2097152);
    });

    it("Should clear() clear the cache and remove all ietms", () => {
        const cache = new KeyValueCache();
        cache.put("key", "value");
        expect(cache.get("key")).equal("value");
        cache.clear();
        expect(cache.get("key")).equal(undefined);
    });

    it("Should get key value", () => {
        expect(keyValueCache1.get("key1")).equal("value1");
        expect(keyValueCache1.get("key2")).equal("value2");
    });
});
