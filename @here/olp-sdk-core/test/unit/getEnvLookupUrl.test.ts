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
import { getEnvLookUpUrl } from "@here/olp-sdk-core";

chai.use(sinonChai);

const expect = chai.expect;

describe("getEnvLookUpUrl", () => {
    it("Should return default url", () => {
        expect(getEnvLookUpUrl("invalid environment name string")).to.be.equal(
            "https://api-lookup.data.api.platform.here.com/lookup/v1"
        );
        expect(getEnvLookUpUrl("")).to.be.equal(
            "https://api-lookup.data.api.platform.here.com/lookup/v1"
        );
    });

    it("Should return url to the development instance", () => {
        expect(getEnvLookUpUrl("here-dev")).to.be.equal(
            "https://api-lookup.data.api.platform.in.here.com/lookup/v1"
        );
    });

    it("Should return url to the production instance", () => {
        expect(getEnvLookUpUrl("here")).to.be.equal(
            "https://api-lookup.data.api.platform.here.com/lookup/v1"
        );
    });

    it("Should return url to the china production instance", () => {
        expect(getEnvLookUpUrl("here-cn")).to.be.equal(
            "https://api-lookup.data.api.platform.hereolp.cn/lookup/v1"
        );
    });

    it("Should return url to the china development instance", () => {
        expect(getEnvLookUpUrl("here-cn-dev")).to.be.equal(
            "https://api-lookup.data.api.platform.in.hereolp.cn/lookup/v1"
        );
    });

    it("Should return url to the localhost instance", () => {
        expect(getEnvLookUpUrl("local")).to.be.equal(
            "http://localhost:31005/lookup/v1"
        );
    });

    it("Should return url to the custom instance", () => {
        expect(getEnvLookUpUrl("http://localhost:3000/lookup/v1")).to.be.equal(
            "http://localhost:3000/lookup/v1"
        );
        expect(getEnvLookUpUrl("https://localhost:3000/lookup/v1")).to.be.equal(
            "https://localhost:3000/lookup/v1"
        );
        expect(getEnvLookUpUrl("http://127.0.0.1:3000/lookup/v1")).to.be.equal(
            "http://127.0.0.1:3000/lookup/v1"
        );
        expect(getEnvLookUpUrl("http://example.com")).to.be.equal(
            "http://example.com"
        );
    });
});
