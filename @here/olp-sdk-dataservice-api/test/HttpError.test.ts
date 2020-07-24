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
import { HttpError } from "../index";

const assert = chai.assert;
const expect = chai.expect;

describe("HttpErrorTest", function() {
    const NOT_FOUND_ERROR_CODE = 404;
    const error = new HttpError(NOT_FOUND_ERROR_CODE, "Not found");

    it("HttpError shoud be initialized", async function() {
        assert.isDefined(error);
        expect(error).to.be.instanceOf(Error);
        expect(error).to.be.instanceOf(HttpError);
    });

    it("HttpError should have parameters status, message and name", async function() {
        expect(error.status).to.be.equal(NOT_FOUND_ERROR_CODE);
        expect(error.message).to.be.equal("Not found");
        expect(error.name).to.be.equal("HttpError");
    });
});
