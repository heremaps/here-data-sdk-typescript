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

import { assert } from "chai";
import { HRN } from "@here/olp-sdk-core";

describe("HRN", () => {
    it("fromString", () => {
        const hrnString = "hrn:here:datastore:::testcatalog";
        assert.strictEqual(HRN.fromString(hrnString).toString(), hrnString);
    });

    it("localURL", () => {
        const hrn = HRN.fromString("http://localhost:5000");

        assert.strictEqual(hrn.data.partition, "catalog-url");
        assert.strictEqual(hrn.data.service, "datastore");
        assert.strictEqual(hrn.data.region, "");
        assert.strictEqual(hrn.data.account, "");
    });

    it("additionalFields", () => {
        const hrn = HRN.fromString(
            "hrn:here:datastore:::testcatalog:some:additional:fields"
        );
        assert.sameOrderedMembers(hrn.data.resource.split(":"), [
            "testcatalog",
            "some",
            "additional",
            "fields"
        ]);
    });

    it("HRN throw Error on malformed input data", () => {
        let caught = false;
        try {
            // tslint:disable-next-line:no-unused-variable
            const invalidHRN = HRN.fromString("hrn:nothing:");
        } catch (err) {
            assert.isTrue(err instanceof Error);
            assert.strictEqual((err as Error).message, "Invalid HRN");
            caught = true;
        }
        assert.isTrue(caught);

        let caught2 = false;
        try {
            // tslint:disable-next-line:no-unused-variable
            const invalidHRNpartition = HRN.fromString("hrzz:nothing:");
        } catch (err) {
            assert.isTrue(err instanceof Error);
            assert.strictEqual((err as Error).message, "Invalid HRN");
            caught2 = true;
        }
        assert.isTrue(caught2);
    });
});
