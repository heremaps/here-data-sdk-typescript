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
import { addSentWithParam, SENT_WITH_PARAM } from "@here/olp-sdk-core";

describe("addSentWithParam", function() {
    it("Should be preparing string as an adding additional param", function() {
        const url = "https://example.com/test/url?someParam=test";

        const result = addSentWithParam(url);

        assert.isTrue(result === url + "&" + SENT_WITH_PARAM);
    });

    it("Should be preparing string as an adding the first param", function() {
        const url = "https://example.com/test/url";

        const result = addSentWithParam(url);

        assert.isTrue(result === url + "?" + SENT_WITH_PARAM);
    });
});
