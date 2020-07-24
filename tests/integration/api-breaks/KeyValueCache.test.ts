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

import { KeyValueCache } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("KeyValueCache", function() {
  it("Shoud be initialized withouth arguments", async function() {
    const testKeyValueCache = new KeyValueCache();
    assert.isDefined(testKeyValueCache);

    expect(testKeyValueCache).to.be.instanceOf(KeyValueCache);
    assert.isDefined(testKeyValueCache.put);
    assert.isDefined(testKeyValueCache.get);
    assert.isDefined(testKeyValueCache.remove);
  });

  it("Test put method with params", async function() {
    const testKeyValueCache = new KeyValueCache();

    const response = testKeyValueCache.put("test-key", "test");
    assert.isTrue(response);
  });

  it("Test get method with params", async function() {
    const testKeyValueCache = new KeyValueCache();
    testKeyValueCache.put("test-key", "test");

    const response = testKeyValueCache.get("test-key");
    assert.isDefined(response);
  });

  it("Test remove method with params", async function() {
    const testKeyValueCache = new KeyValueCache();
    testKeyValueCache.put("test-key", "test");
    testKeyValueCache.put("test-key2", "test");

    const response = testKeyValueCache.remove("test-key");
    assert.isTrue(response);
  });
});
