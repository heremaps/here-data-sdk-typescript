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

import { HttpError } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("HttpError", function() {
  it("Shoud be initialized with arguments", async function() {
    const testError = new HttpError(101, "Test Error");
    assert.isDefined(testError);

    expect(testError).to.be.instanceOf(HttpError);
    assert.isDefined(testError.status);
    assert.isDefined(testError.message);
  });

  it("Test isHttpError method with HttpError", async function() {
    const testError = new HttpError(101, "Test Error");
    const response = HttpError.isHttpError(testError);
    assert.isTrue(response);
  });
});
