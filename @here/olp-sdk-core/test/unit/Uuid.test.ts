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

// tslint:disable:only-arrow-functions
//    Mocha discourages using arrow functions, see https://mochajs.org/#arrow-functions

import { assert } from "chai";
import { Uuid } from "@here/olp-sdk-core";

describe("Uuid", function() {
    it("Should be unique and valid value", function() {
        const validator = new RegExp(
            "^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$",
            "i"
        );
        const uuids = [];
        for (let index = 0; index < 5000; index++) {
            const uuid = Uuid.create();
            assert.isTrue(validator.test(uuid));
            assert.isTrue(uuids.indexOf(uuid) === -1);
            uuids.push(uuid);
        }

        assert.isTrue(uuids.indexOf(Uuid.create()) === -1);
    });
});
